import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../utils/api";

function SiteSettings() {
  const token = localStorage.getItem("adminToken");

  const [form, setForm] = useState({
    contactPage: {
      badge: "",
      heroTitle: "",
      heroDescription: "",
      callLabel: "",
      callValue: "",
      emailLabel: "",
      emailValue: "",
      companyTitle: "",
      companyName: "",
      companyAddress: "",
      topCards: [
        { title: "Phone", value: "", subtitle: "( 9 AM – 6 PM )" },
        {
          title: "Email",
          value: "",
          subtitle: "Best for screenshots & details",
        },
        { title: "Languages", value: "Hindi • English", subtitle: "" },
      ],
      supportPoints: [
        { title: "", subtitle: "" },
        { title: "", subtitle: "" },
        { title: "", subtitle: "" },
      ],
      faqsTitle: "",
      faqsSubtitle: "",
      faqs: [
        { question: "", answer: "" },
        { question: "", answer: "" },
      ],
    },

    refundPolicy: {
      title: "",
      content: "",
    },

    privacyPolicy: {
      title: "",
      content: "",
    },

    termsAndConditions: {
      title: "",
      content: "",
    },

    franchiseTermsAndConditions: {
      title: "",
      content: "",
    },

    becomeAffiliate: {
      title: "",
      content: "",
    },

    endUserLicenseAgreement: {
      title: "",
      content: "",
    },

    disclaimer: {
      title: "",
      content: "",
    },

    paymentTransferTerms: {
      title: "",
      content: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/site-settings`);

      if (res.data.success && res.data.settings) {
        const settings = res.data.settings;

        setForm({
          contactPage: {
            badge: settings.contactPage?.badge || "",
            heroTitle: settings.contactPage?.heroTitle || "",
            heroDescription: settings.contactPage?.heroDescription || "",
            callLabel: settings.contactPage?.callLabel || "",
            callValue: settings.contactPage?.callValue || "",
            emailLabel: settings.contactPage?.emailLabel || "",
            emailValue: settings.contactPage?.emailValue || "",
            companyTitle: settings.contactPage?.companyTitle || "",
            companyName: settings.contactPage?.companyName || "",
            companyAddress: settings.contactPage?.companyAddress || "",
            topCards:
              settings.contactPage?.topCards?.length > 0
                ? settings.contactPage.topCards
                : [
                    { title: "Phone", value: "", subtitle: "( 9 AM – 6 PM )" },
                    {
                      title: "Email",
                      value: "",
                      subtitle: "Best for screenshots & details",
                    },
                    {
                      title: "Languages",
                      value: "Hindi • English",
                      subtitle: "",
                    },
                  ],
            supportPoints:
              settings.contactPage?.supportPoints?.length > 0
                ? settings.contactPage.supportPoints
                : [
                    { title: "", subtitle: "" },
                    { title: "", subtitle: "" },
                    { title: "", subtitle: "" },
                  ],
            faqsTitle: settings.contactPage?.faqsTitle || "",
            faqsSubtitle: settings.contactPage?.faqsSubtitle || "",
            faqs:
              settings.contactPage?.faqs?.length > 0
                ? settings.contactPage.faqs
                : [
                    { question: "", answer: "" },
                    { question: "", answer: "" },
                  ],
          },

          refundPolicy: {
            title: settings.refundPolicy?.title || "",
            content: settings.refundPolicy?.content || "",
          },

          privacyPolicy: {
            title: settings.privacyPolicy?.title || "",
            content: settings.privacyPolicy?.content || "",
          },

          termsAndConditions: {
            title: settings.termsAndConditions?.title || "",
            content: settings.termsAndConditions?.content || "",
          },

          franchiseTermsAndConditions: {
            title: settings.franchiseTermsAndConditions?.title || "",
            content: settings.franchiseTermsAndConditions?.content || "",
          },

          becomeAffiliate: {
            title: settings.becomeAffiliate?.title || "",
            content: settings.becomeAffiliate?.content || "",
          },

          endUserLicenseAgreement: {
            title: settings.endUserLicenseAgreement?.title || "",
            content: settings.endUserLicenseAgreement?.content || "",
          },

          disclaimer: {
            title: settings.disclaimer?.title || "",
            content: settings.disclaimer?.content || "",
          },

          paymentTransferTerms: {
            title: settings.paymentTransferTerms?.title || "",
            content: settings.paymentTransferTerms?.content || "",
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNestedChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayItemChange = (section, arrayField, index, field, value) => {
    setForm((prev) => {
      const updatedArray = [...prev[section][arrayField]];
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: value,
      };

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayField]: updatedArray,
        },
      };
    });
  };

  const addArrayItem = (section, arrayField, newItem) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayField]: [...prev[section][arrayField], newItem],
      },
    }));
  };

  const removeArrayItem = (section, arrayField, index) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayField]: prev[section][arrayField].filter((_, i) => i !== index),
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const syncedTopCards = [...(form.contactPage.topCards || [])];

      while (syncedTopCards.length < 3) {
        syncedTopCards.push({ title: "", value: "", subtitle: "" });
      }

      syncedTopCards[0] = {
        title: syncedTopCards[0]?.title || "Phone",
        value: form.contactPage.callValue || "",
        subtitle: syncedTopCards[0]?.subtitle || "( 9 AM – 6 PM )",
      };

      syncedTopCards[1] = {
        title: syncedTopCards[1]?.title || "Email",
        value: form.contactPage.emailValue || "",
        subtitle:
          syncedTopCards[1]?.subtitle || "Best for screenshots & details",
      };

      const payload = {
        ...form,
        contactPage: {
          ...form.contactPage,
          topCards: syncedTopCards,
        },
      };

      const res = await axios.put(`${API}/site-settings/update`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setForm((prev) => ({
          ...prev,
          contactPage: {
            ...prev.contactPage,
            topCards: syncedTopCards,
          },
        }));

        alert("Settings updated successfully");
        await fetchSettings();
      }
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1450px] p-4 md:p-6">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="sticky top-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#07111a] md:text-3xl">
                Site Settings
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage contact page and legal content from here.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-[#0b5c8e] via-[#167a7a] to-[#2e8b57] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>

        <SectionCard title="Contact Page">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              value={form.contactPage.badge}
              onChange={(e) =>
                handleNestedChange("contactPage", "badge", e.target.value)
              }
              placeholder="Badge"
            />

            <Input
              value={form.contactPage.heroTitle}
              onChange={(e) =>
                handleNestedChange("contactPage", "heroTitle", e.target.value)
              }
              placeholder="Hero Title"
            />

            <Input
              value={form.contactPage.callLabel}
              onChange={(e) =>
                handleNestedChange("contactPage", "callLabel", e.target.value)
              }
              placeholder="Call Label"
            />

            <Input
              value={form.contactPage.callValue}
              onChange={(e) =>
                handleNestedChange("contactPage", "callValue", e.target.value)
              }
              placeholder="Call Number"
            />

            <Input
              value={form.contactPage.emailLabel}
              onChange={(e) =>
                handleNestedChange("contactPage", "emailLabel", e.target.value)
              }
              placeholder="Email Label"
            />

            <Input
              value={form.contactPage.emailValue}
              onChange={(e) =>
                handleNestedChange("contactPage", "emailValue", e.target.value)
              }
              placeholder="Email Value"
            />

            <Input
              value={form.contactPage.companyTitle}
              onChange={(e) =>
                handleNestedChange(
                  "contactPage",
                  "companyTitle",
                  e.target.value,
                )
              }
              placeholder="Company Section Title"
            />

            <Input
              value={form.contactPage.companyName}
              onChange={(e) =>
                handleNestedChange("contactPage", "companyName", e.target.value)
              }
              placeholder="Company Name"
            />
          </div>

          <div className="mt-4">
            <Textarea
              value={form.contactPage.heroDescription}
              onChange={(e) =>
                handleNestedChange(
                  "contactPage",
                  "heroDescription",
                  e.target.value,
                )
              }
              placeholder="Hero Description"
              rows="3"
            />
          </div>

          <div className="mt-4">
            <Textarea
              value={form.contactPage.companyAddress}
              onChange={(e) =>
                handleNestedChange(
                  "contactPage",
                  "companyAddress",
                  e.target.value,
                )
              }
              placeholder="Company Address"
              rows="3"
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Top Contact Cards"
          action={
            <button
              type="button"
              onClick={() =>
                addArrayItem("contactPage", "topCards", {
                  title: "",
                  value: "",
                  subtitle: "",
                })
              }
              className="rounded-xl bg-[#07111a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b5c8e]"
            >
              Add Card
            </button>
          }
        >
          <p className="mb-4 text-sm text-slate-500">
            First card phone number aur second card email automatically Call
            Number aur Email Value se sync honge.
          </p>

          <div className="grid gap-4 xl:grid-cols-2">
            {form.contactPage.topCards.map((card, index) => (
              <CardBlock
                key={index}
                title={`Card ${index + 1}`}
                removable={form.contactPage.topCards.length > 1}
                onRemove={() =>
                  removeArrayItem("contactPage", "topCards", index)
                }
              >
                <div className="grid gap-4">
                  <Input
                    value={card.title}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "contactPage",
                        "topCards",
                        index,
                        "title",
                        e.target.value,
                      )
                    }
                    placeholder="Card Title"
                  />

                  <Input
                    value={
                      index === 0
                        ? form.contactPage.callValue
                        : index === 1
                          ? form.contactPage.emailValue
                          : card.value
                    }
                    onChange={(e) =>
                      index === 0
                        ? handleNestedChange(
                            "contactPage",
                            "callValue",
                            e.target.value,
                          )
                        : index === 1
                          ? handleNestedChange(
                              "contactPage",
                              "emailValue",
                              e.target.value,
                            )
                          : handleArrayItemChange(
                              "contactPage",
                              "topCards",
                              index,
                              "value",
                              e.target.value,
                            )
                    }
                    placeholder="Card Value"
                  />

                  <Input
                    value={card.subtitle}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "contactPage",
                        "topCards",
                        index,
                        "subtitle",
                        e.target.value,
                      )
                    }
                    placeholder="Card Subtitle"
                  />
                </div>
              </CardBlock>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Support Points"
          action={
            <button
              type="button"
              onClick={() =>
                addArrayItem("contactPage", "supportPoints", {
                  title: "",
                  subtitle: "",
                })
              }
              className="rounded-xl bg-[#07111a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b5c8e]"
            >
              Add Point
            </button>
          }
        >
          <div className="grid gap-4 xl:grid-cols-2">
            {form.contactPage.supportPoints.map((point, index) => (
              <CardBlock
                key={index}
                title={`Point ${index + 1}`}
                removable={form.contactPage.supportPoints.length > 1}
                onRemove={() =>
                  removeArrayItem("contactPage", "supportPoints", index)
                }
              >
                <div className="grid gap-4">
                  <Input
                    value={point.title}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "contactPage",
                        "supportPoints",
                        index,
                        "title",
                        e.target.value,
                      )
                    }
                    placeholder="Point Title"
                  />

                  <Input
                    value={point.subtitle}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "contactPage",
                        "supportPoints",
                        index,
                        "subtitle",
                        e.target.value,
                      )
                    }
                    placeholder="Point Subtitle"
                  />
                </div>
              </CardBlock>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Contact FAQs"
          action={
            <button
              type="button"
              onClick={() =>
                addArrayItem("contactPage", "faqs", {
                  question: "",
                  answer: "",
                })
              }
              className="rounded-xl bg-[#07111a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b5c8e]"
            >
              Add FAQ
            </button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              value={form.contactPage.faqsTitle}
              onChange={(e) =>
                handleNestedChange("contactPage", "faqsTitle", e.target.value)
              }
              placeholder="FAQ Section Title"
            />

            <Input
              value={form.contactPage.faqsSubtitle}
              onChange={(e) =>
                handleNestedChange(
                  "contactPage",
                  "faqsSubtitle",
                  e.target.value,
                )
              }
              placeholder="FAQ Section Subtitle"
            />
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {form.contactPage.faqs.map((faq, index) => (
              <CardBlock
                key={index}
                title={`FAQ ${index + 1}`}
                removable={form.contactPage.faqs.length > 1}
                onRemove={() => removeArrayItem("contactPage", "faqs", index)}
              >
                <div className="grid gap-4">
                  <Input
                    value={faq.question}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "contactPage",
                        "faqs",
                        index,
                        "question",
                        e.target.value,
                      )
                    }
                    placeholder="FAQ Question"
                  />

                  <Textarea
                    value={faq.answer}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "contactPage",
                        "faqs",
                        index,
                        "answer",
                        e.target.value,
                      )
                    }
                    placeholder="FAQ Answer"
                    rows="4"
                  />
                </div>
              </CardBlock>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Privacy Policy">
          <div className="grid gap-4">
            <Input
              value={form.privacyPolicy.title}
              onChange={(e) =>
                handleNestedChange("privacyPolicy", "title", e.target.value)
              }
              placeholder="Privacy Policy Title"
            />

            <Textarea
              value={form.privacyPolicy.content}
              onChange={(e) =>
                handleNestedChange("privacyPolicy", "content", e.target.value)
              }
              placeholder="Privacy Policy Content"
              rows="10"
            />
          </div>
        </SectionCard>

        <SectionCard title="Refund Policy">
          <div className="grid gap-4">
            <Input
              value={form.refundPolicy.title}
              onChange={(e) =>
                handleNestedChange("refundPolicy", "title", e.target.value)
              }
              placeholder="Refund Policy Title"
            />

            <Textarea
              value={form.refundPolicy.content}
              onChange={(e) =>
                handleNestedChange("refundPolicy", "content", e.target.value)
              }
              placeholder="Refund Policy Content"
              rows="10"
            />
          </div>
        </SectionCard>

        <SectionCard title="Terms & Conditions">
          <div className="grid gap-4">
            <Input
              value={form.termsAndConditions.title}
              onChange={(e) =>
                handleNestedChange(
                  "termsAndConditions",
                  "title",
                  e.target.value,
                )
              }
              placeholder="Terms Title"
            />

            <Textarea
              value={form.termsAndConditions.content}
              onChange={(e) =>
                handleNestedChange(
                  "termsAndConditions",
                  "content",
                  e.target.value,
                )
              }
              placeholder="Terms Content"
              rows="10"
            />
          </div>
        </SectionCard>

        <SectionCard title="Franchise Terms & Conditions">
          <div className="grid gap-4">
            <Input
              value={form.franchiseTermsAndConditions.title}
              onChange={(e) =>
                handleNestedChange(
                  "franchiseTermsAndConditions",
                  "title",
                  e.target.value,
                )
              }
              placeholder="Franchise Terms Title"
            />

            <Textarea
              value={form.franchiseTermsAndConditions.content}
              onChange={(e) =>
                handleNestedChange(
                  "franchiseTermsAndConditions",
                  "content",
                  e.target.value,
                )
              }
              placeholder="Franchise Terms Content"
              rows="10"
            />
          </div>
        </SectionCard>

        <SectionCard title="Become An Affiliate">
          <div className="grid gap-4">
            <Input
              value={form.becomeAffiliate.title}
              onChange={(e) =>
                handleNestedChange("becomeAffiliate", "title", e.target.value)
              }
              placeholder="Become An Affiliate Title"
            />

            <Textarea
              value={form.becomeAffiliate.content}
              onChange={(e) =>
                handleNestedChange("becomeAffiliate", "content", e.target.value)
              }
              placeholder="Become An Affiliate Content"
              rows="10"
            />
          </div>
        </SectionCard>

        <SectionCard title="End User License Agreement">
          <div className="grid gap-4">
            <Input
              value={form.endUserLicenseAgreement.title}
              onChange={(e) =>
                handleNestedChange(
                  "endUserLicenseAgreement",
                  "title",
                  e.target.value,
                )
              }
              placeholder="EULA Title"
            />

            <Textarea
              value={form.endUserLicenseAgreement.content}
              onChange={(e) =>
                handleNestedChange(
                  "endUserLicenseAgreement",
                  "content",
                  e.target.value,
                )
              }
              placeholder="EULA Content"
              rows="10"
            />
          </div>
        </SectionCard>

        <SectionCard title="Disclaimer">
          <div className="grid gap-4">
            <Input
              value={form.disclaimer.title}
              onChange={(e) =>
                handleNestedChange("disclaimer", "title", e.target.value)
              }
              placeholder="Disclaimer Title"
            />

            <Textarea
              value={form.disclaimer.content}
              onChange={(e) =>
                handleNestedChange("disclaimer", "content", e.target.value)
              }
              placeholder="Disclaimer Content"
              rows="10"
            />
          </div>
        </SectionCard>

        <SectionCard title="Payment Transfer Terms and Conditions">
          <div className="grid gap-4">
            <Input
              value={form.paymentTransferTerms.title}
              onChange={(e) =>
                handleNestedChange(
                  "paymentTransferTerms",
                  "title",
                  e.target.value,
                )
              }
              placeholder="Payment Transfer Terms Title"
            />

            <Textarea
              value={form.paymentTransferTerms.content}
              onChange={(e) =>
                handleNestedChange(
                  "paymentTransferTerms",
                  "content",
                  e.target.value,
                )
              }
              placeholder="Payment Transfer Terms Content"
              rows="10"
            />
          </div>
        </SectionCard>
      </form>
    </div>
  );
}

export default SiteSettings;

function SectionCard({ title, children, action = null }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold text-[#07111a]">{title}</h2>
        {action}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function CardBlock({ title, children, removable = false, onRemove }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-[#07111a]">{title}</h3>
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
          >
            Remove
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-[#07111a] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
    />
  );
}
