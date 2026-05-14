import { useEffect, useState } from "react";
import { API } from "../../utils/videoHelpers";

const emptyPlan = (prefix = "plan") => ({
  key: `${prefix}_${Date.now()}`,
  title: "",
  price: "",
  oldPrice: "",
  badge: "",
  subtitle: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  active: true,
  popular: false,
  features: [{ text: "" }],
});

const defaultSettings = {
  mobileSection: {
    badge: "Premium Access",
    heading: "Choose your plan",
    subtitle: "Unlock all videos or continue with basic access",
    heroVideo: "",
    buyButtonText: "Buy Plan",
    continueButtonText: "Continue Without Plan",
    termsText: "I agree to Terms & Conditions",
    plans: [],
  },
  businessSection: {
    badge: "Business Plans",
    heading: "Choose the right plan for your growth",
    subtitle: "Simple pricing for creators, learners and business users.",
    ctaText: "Get Started",
    plans: [],
  },
  memberSection: {
  badge: "Membership Plans",
  heading: "Become a Member",
  subtitle: "Choose a membership plan to unlock earning access and member benefits.",
  ctaText: "Join Now",
  plans: [],
},
};

function PlansAdmin() {
  const [form, setForm] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const mergeSettings = (settings) => ({
    ...defaultSettings,
    ...settings,
    mobileSection: {
      ...defaultSettings.mobileSection,
      ...(settings?.mobileSection || {}),
      plans: settings?.mobileSection?.plans || [],
    },
    businessSection: {
      ...defaultSettings.businessSection,
      ...(settings?.businessSection || {}),
      plans: settings?.businessSection?.plans || [],
    },
    memberSection: {
  ...defaultSettings.memberSection,
  ...(settings?.memberSection || {}),
  plans: settings?.memberSection?.plans || [],
},
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/plan-settings`);
      const data = await res.json();

      if (data.success && data.settings) {
        setForm(mergeSettings(data.settings));
      }
    } catch (error) {
      console.error("Failed to fetch plan settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handlePlanChange = (section, index, field, value) => {
    setForm((prev) => {
      const plans = [...(prev[section].plans || [])];
      plans[index] = { ...plans[index], [field]: value };

      return {
        ...prev,
        [section]: {
          ...prev[section],
          plans,
        },
      };
    });
  };

 const addPlan = (section) => {
  const prefix =
    section === "businessSection"
      ? "business"
      : section === "memberSection"
      ? "member"
      : "mobile";

  setForm((prev) => ({
    ...prev,
    [section]: {
      ...prev[section],
      plans: [...(prev[section].plans || []), emptyPlan(prefix)],
    },
  }));
};

  const duplicatePlan = (section, index) => {
    setForm((prev) => {
      const plans = [...(prev[section].plans || [])];
      const current = plans[index];

      plans.splice(index + 1, 0, {
        ...current,
        key: `${current.key || "plan"}_copy_${Date.now()}`,
        title: `${current.title || "Plan"} Copy`,
      });

      return {
        ...prev,
        [section]: {
          ...prev[section],
          plans,
        },
      };
    });
  };

  const removePlan = (section, index) => {
    if (!window.confirm("Is plan ko delete karna hai?")) return;

    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        plans: (prev[section].plans || []).filter((_, i) => i !== index),
      },
    }));
  };

  const movePlan = (section, index, direction) => {
    setForm((prev) => {
      const plans = [...(prev[section].plans || [])];
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= plans.length) return prev;

      [plans[index], plans[targetIndex]] = [plans[targetIndex], plans[index]];

      return {
        ...prev,
        [section]: {
          ...prev[section],
          plans,
        },
      };
    });
  };

  const addFeature = (section, planIndex) => {
    setForm((prev) => {
      const plans = [...(prev[section].plans || [])];

      plans[planIndex] = {
        ...plans[planIndex],
        features: [...(plans[planIndex].features || []), { text: "" }],
      };

      return {
        ...prev,
        [section]: {
          ...prev[section],
          plans,
        },
      };
    });
  };

  const handleFeatureChange = (section, planIndex, featureIndex, value) => {
    setForm((prev) => {
      const plans = [...(prev[section].plans || [])];
      const features = [...(plans[planIndex].features || [])];

      features[featureIndex] = { text: value };
      plans[planIndex] = { ...plans[planIndex], features };

      return {
        ...prev,
        [section]: {
          ...prev[section],
          plans,
        },
      };
    });
  };

  const removeFeature = (section, planIndex, featureIndex) => {
    setForm((prev) => {
      const plans = [...(prev[section].plans || [])];

      plans[planIndex] = {
        ...plans[planIndex],
        features: (plans[planIndex].features || []).filter(
          (_, i) => i !== featureIndex
        ),
      };

      return {
        ...prev,
        [section]: {
          ...prev[section],
          plans,
        },
      };
    });
  };

  const cleanPayload = () => {
    const cleanSection = (section) => ({
      ...section,
      plans: (section.plans || [])
        .filter((plan) => plan.key && plan.title)
        .map((plan) => ({
          ...plan,
          features: (plan.features || []).filter((feature) =>
            feature.text?.trim()
          ),
        })),
    });

   return {
  mobileSection: cleanSection(form.mobileSection),
  businessSection: cleanSection(form.businessSection),
  memberSection: cleanSection(form.memberSection),
};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const token = localStorage.getItem("adminToken");
      const payload = cleanPayload();

      const res = await fetch(`${API}/plan-settings/admin/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Plan settings updated successfully");
        setForm(mergeSettings(data.settings));
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save plan settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
        Loading plans...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-2xl font-bold text-slate-900">Plans Management</h2>
        <p className="mt-2 text-sm text-slate-600">
           Manage both mobile subscription and business plans dynamically from here.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard
          title="Mobile Subscription Section"
          action={
            <button
              type="button"
              onClick={() => addPlan("mobileSection")}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Add Mobile Plan
            </button>
          }
        >
          <SectionFields
            section="mobileSection"
            data={form.mobileSection}
            handleSectionChange={handleSectionChange}
            type="mobile"
          />

          <PlanList
            section="mobileSection"
            plans={form.mobileSection.plans}
            handlePlanChange={handlePlanChange}
            handleFeatureChange={handleFeatureChange}
            addFeature={addFeature}
            removeFeature={removeFeature}
            removePlan={removePlan}
            duplicatePlan={duplicatePlan}
            movePlan={movePlan}
          />
        </SectionCard>

        <SectionCard
          title="Desktop Business Plan Section"
          action={
            <button
              type="button"
              onClick={() => addPlan("businessSection")}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Add Business Plan
            </button>
          }
        >
          <SectionFields
            section="businessSection"
            data={form.businessSection}
            handleSectionChange={handleSectionChange}
            type="business"
          />

          <PlanList
            section="businessSection"
            plans={form.businessSection.plans}
            handlePlanChange={handlePlanChange}
            handleFeatureChange={handleFeatureChange}
            addFeature={addFeature}
            removeFeature={removeFeature}
            removePlan={removePlan}
            duplicatePlan={duplicatePlan}
            movePlan={movePlan}
          />
        </SectionCard>

        <SectionCard
  title="Member Plans Section"
  action={
    <button
      type="button"
      onClick={() => addPlan("memberSection")}
      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
    >
      Add Member Plan
    </button>
  }
>
  <SectionFields
    section="memberSection"
    data={form.memberSection}
    handleSectionChange={handleSectionChange}
    type="business"
  />

  <PlanList
    section="memberSection"
    plans={form.memberSection.plans}
    handlePlanChange={handlePlanChange}
    handleFeatureChange={handleFeatureChange}
    addFeature={addFeature}
    removeFeature={removeFeature}
    removePlan={removePlan}
    duplicatePlan={duplicatePlan}
    movePlan={movePlan}
  />
</SectionCard>

        <div className="sticky bottom-4 z-20 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-[#0b5c8e] via-[#167a7a] to-[#2e8b57] px-7 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save All Plans"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PlansAdmin;

function SectionFields({ section, data, handleSectionChange, type }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Input
        label="Badge"
        value={data.badge}
        onChange={(value) => handleSectionChange(section, "badge", value)}
      />

      <Input
        label="Heading"
        value={data.heading}
        onChange={(value) => handleSectionChange(section, "heading", value)}
      />

      <div className="md:col-span-2">
        <Input
          label="Subtitle"
          value={data.subtitle}
          onChange={(value) => handleSectionChange(section, "subtitle", value)}
        />
      </div>

      {type === "mobile" ? (
        <>
          <div className="md:col-span-2">
            <Input
              label="Hero Video URL"
              value={data.heroVideo}
              onChange={(value) =>
                handleSectionChange(section, "heroVideo", value)
              }
            />
          </div>

          <Input
            label="Buy Button Text"
            value={data.buyButtonText}
            onChange={(value) =>
              handleSectionChange(section, "buyButtonText", value)
            }
          />

          <Input
            label="Continue Button Text"
            value={data.continueButtonText}
            onChange={(value) =>
              handleSectionChange(section, "continueButtonText", value)
            }
          />

          <div className="md:col-span-2">
            <Input
              label="Terms Text"
              value={data.termsText}
              onChange={(value) =>
                handleSectionChange(section, "termsText", value)
              }
            />
          </div>
        </>
      ) : (
        <Input
          label="Default CTA Text"
          value={data.ctaText}
          onChange={(value) => handleSectionChange(section, "ctaText", value)}
        />
      )}
    </div>
  );
}

function PlanList({
  section,
  plans,
  handlePlanChange,
  handleFeatureChange,
  addFeature,
  removeFeature,
  removePlan,
  duplicatePlan,
  movePlan,
}) {
  return (
    <div className="mt-6 space-y-4">
      {(plans || []).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Abhi koi plan nahi hai. Upar Add Plan button se plan add kar.
        </div>
      ) : (
        plans.map((plan, index) => (
          <PlanEditor
            key={plan.key || index}
            title={`${
  section === "businessSection"
    ? "Business"
    : section === "memberSection"
    ? "Member"
    : "Mobile"
} Plan ${index + 1}`}
            plan={plan}
            section={section}
            index={index}
            totalPlans={plans.length}
            handlePlanChange={handlePlanChange}
            handleFeatureChange={handleFeatureChange}
            addFeature={addFeature}
            removeFeature={removeFeature}
            removePlan={removePlan}
            duplicatePlan={duplicatePlan}
            movePlan={movePlan}
          />
        ))
      )}
    </div>
  );
}

function PlanEditor({
  title,
  plan,
  section,
  index,
  totalPlans,
  handlePlanChange,
  handleFeatureChange,
  addFeature,
  removeFeature,
  removePlan,
  duplicatePlan,
  movePlan,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-lg font-semibold text-slate-900">{title}</h4>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => movePlan(section, index, -1)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 disabled:opacity-40"
          >
            Up
          </button>

          <button
            type="button"
            disabled={index === totalPlans - 1}
            onClick={() => movePlan(section, index, 1)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 disabled:opacity-40"
          >
            Down
          </button>

          <button
            type="button"
            onClick={() => duplicatePlan(section, index)}
            className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-600"
          >
            Duplicate
          </button>

          <button
            type="button"
            onClick={() => removePlan(section, index)}
            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Plan Key / Slug"
          value={plan.key}
          onChange={(value) => handlePlanChange(section, index, "key", value)}
        />

        <Input
          label="Title"
          value={plan.title}
          onChange={(value) => handlePlanChange(section, index, "title", value)}
        />

        <Input
          label="Subtitle"
          value={plan.subtitle}
          onChange={(value) =>
            handlePlanChange(section, index, "subtitle", value)
          }
        />

        <Input
          label="Price"
          value={plan.price}
          onChange={(value) => handlePlanChange(section, index, "price", value)}
        />

        <Input
          label="Old Price"
          value={plan.oldPrice}
          onChange={(value) =>
            handlePlanChange(section, index, "oldPrice", value)
          }
        />

        <Input
          label="Badge"
          value={plan.badge}
          onChange={(value) => handlePlanChange(section, index, "badge", value)}
        />

        <Input
          label="Button Text Optional"
          value={plan.buttonText}
          onChange={(value) =>
            handlePlanChange(section, index, "buttonText", value)
          }
        />

        <Input
          label="Button Link Optional"
          value={plan.buttonLink}
          onChange={(value) =>
            handlePlanChange(section, index, "buttonLink", value)
          }
        />

        <div className="md:col-span-2">
          <Textarea
            label="Description"
            value={plan.description}
            onChange={(value) =>
              handlePlanChange(section, index, "description", value)
            }
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-5">
        <Checkbox
          label="Active"
          checked={!!plan.active}
          onChange={(checked) =>
            handlePlanChange(section, index, "active", checked)
          }
        />

        <Checkbox
          label="Popular / Highlight"
          checked={!!plan.popular}
          onChange={(checked) =>
            handlePlanChange(section, index, "popular", checked)
          }
        />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-800">Features</p>

          <button
            type="button"
            onClick={() => addFeature(section, index)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
          >
            Add Feature
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {(plan.features || []).length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
              No features added.
            </p>
          ) : (
            (plan.features || []).map((feature, featureIndex) => (
              <div key={featureIndex} className="flex gap-3">
                <input
                  value={feature.text || ""}
                  onChange={(e) =>
                    handleFeatureChange(
                      section,
                      index,
                      featureIndex,
                      e.target.value
                    )
                  }
                  className="h-11 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
                  placeholder="Example: 3 Classes"
                />

                <button
                  type="button"
                  onClick={() => removeFeature(section, index, featureIndex)}
                  className="rounded-xl border border-red-200 px-4 text-sm font-medium text-red-600"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, action, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        {action}
      </div>

      <div className="mt-5">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <textarea
        rows={3}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
      />
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />

      {label}
    </label>
  );
}