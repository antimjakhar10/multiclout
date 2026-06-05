import { useEffect, useState } from "react";
import { API, API_HOST } from "../../utils/api";

const createCardItem = () => ({
  title: "",
  description: "",
  image: "",
});

const createProcessItem = () => ({
  step: "",
  title: "",
  description: "",
});

const createStatItem = () => ({
  label: "",
  value: "",
});

function FranchiseAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const token = localStorage.getItem("adminToken");

  const [form, setForm] = useState({
    hero: {
      badge: "",
      title: "",
      subtitle: "",
      backgroundImage: "",
      stats: [],
    },

    enquirySection: {
      heading: "",
      title: "",
      subtitle: "",
    },

    whyFranchise: {
      heading: "",
      title: "",
      items: [],
    },

    brandStats: {
      heading: "",
      title: "",
      image: "",
      stats: [],
    },

    franchiseBannerSection: {
      heading: "",
      title: "",
      subtitle: "",
      image: "",
    },

    factsSection: {
      heading: "",
      backgroundImage: "",
      stats: [],
    },

    founder: {
      heading: "",
      name: "",
      designation: "",
      message: "",
      image: "",
    },

    idealPartner: {
      heading: "",
      title: "",
      items: [],
    },

    deliveryModes: {
      heading: "",
      title: "",
      items: [],
    },

    supportSystem: {
      heading: "",
      title: "",
      items: [],
    },

    processSection: {
      heading: "",
      title: "",
      items: [],
    },

    videoSection: {
      heading: "",
      title: "",
      youtubeUrl: "",
      thumbnail: "",
    },

    logosSection: {
      heading: "",
      title: "",
      logos: [],
    },
  });

  useEffect(() => {
    fetchFranchiseData();
  }, []);

  const fetchFranchiseData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/franchise`);
      const json = await res.json();

      if (json.success && json.data) {
        setForm((prev) => ({
          ...prev,
          ...json.data,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch franchise data:", error);
      alert("Failed to load franchise data");
    } finally {
      setLoading(false);
    }
  };

  const handleTopLevelChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayItemChange = (
    section,
    index,
    field,
    value,
    arrayKey = "items",
  ) => {
    setForm((prev) => {
      const updated = [...(prev[section]?.[arrayKey] || [])];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayKey]: updated,
        },
      };
    });
  };

  const addArrayItem = (section, item, arrayKey = "items") => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayKey]: [...(prev[section]?.[arrayKey] || []), item],
      },
    }));
  };

  const removeArrayItem = (section, index, arrayKey = "items") => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayKey]: (prev[section]?.[arrayKey] || []).filter(
          (_, i) => i !== index,
        ),
      },
    }));
  };

  const handleLogoChange = (index, value) => {
    setForm((prev) => {
      const updated = [...(prev.logosSection?.logos || [])];
      updated[index] = value;

      return {
        ...prev,
        logosSection: {
          ...prev.logosSection,
          logos: updated,
        },
      };
    });
  };

  const addLogo = () => {
    setForm((prev) => ({
      ...prev,
      logosSection: {
        ...prev.logosSection,
        logos: [...(prev.logosSection?.logos || []), ""],
      },
    }));
  };

  const removeLogo = (index) => {
    setForm((prev) => ({
      ...prev,
      logosSection: {
        ...prev.logosSection,
        logos: (prev.logosSection?.logos || []).filter((_, i) => i !== index),
      },
    }));
  };

  const saveData = async () => {
    try {
      setSaving(true);

      const res = await fetch(`${API}/franchise/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (result.success) {
        alert("Franchise page saved successfully");
      } else {
        alert(result.message || "Failed to save franchise data");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save franchise data");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1400px] p-4 md:p-5 xl:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          Loading franchise admin...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 p-4 md:p-5 xl:p-6">
      <div className="sticky top-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[26px] font-bold leading-tight text-[#07111a]">
              Franchise Page Admin
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage all franchise page content and images from here.
            </p>
          </div>

          <button
            onClick={saveData}
            disabled={saving || uploading}
            className="inline-flex min-w-[210px] items-center justify-center rounded-xl bg-gradient-to-r from-[#0b5c8e] via-[#167a7a] to-[#2e8b57] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
          >
            {uploading
              ? "Uploading Image..."
              : saving
                ? "Saving..."
                : "Save Franchise Data"}
          </button>
        </div>
      </div>

      <SectionCard title="Hero Section">
        <div className="grid gap-4 xl:grid-cols-2">
          <Input
            label="Badge"
            value={form.hero?.badge}
            onChange={(val) => handleTopLevelChange("hero", "badge", val)}
          />

          <ImageUploadField
            label="Background Image"
            value={form.hero?.backgroundImage}
            setUploading={setUploading}
            onChange={(val) =>
              handleTopLevelChange("hero", "backgroundImage", val)
            }
          />
        </div>

        <div className="mt-4">
          <Input
            label="Hero Title"
            value={form.hero?.title}
            onChange={(val) => handleTopLevelChange("hero", "title", val)}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Hero Subtitle"
            value={form.hero?.subtitle}
            onChange={(val) => handleTopLevelChange("hero", "subtitle", val)}
          />
        </div>

        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-[#07111a]">
              Hero Stats
            </h3>
            <button
              type="button"
              onClick={() => addArrayItem("hero", createStatItem(), "stats")}
              className="inline-flex items-center justify-center rounded-xl bg-[#07111a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b5c8e]"
            >
              Add Stat
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {(form.hero?.stats || []).map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
              >
                <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
                  <Input
                    label="Label"
                    value={item.label}
                    onChange={(val) =>
                      handleArrayItemChange(
                        "hero",
                        index,
                        "label",
                        val,
                        "stats",
                      )
                    }
                  />

                  <Input
                    label="Value"
                    value={item.value}
                    onChange={(val) =>
                      handleArrayItemChange(
                        "hero",
                        index,
                        "value",
                        val,
                        "stats",
                      )
                    }
                  />

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeArrayItem("hero", index, "stats")}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-red-500 px-4 text-sm font-medium text-white transition hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Enquiry Section Headings">
        <div className="grid gap-4 xl:grid-cols-2">
          <Input
            label="Heading"
            value={form.enquirySection?.heading}
            onChange={(val) =>
              handleTopLevelChange("enquirySection", "heading", val)
            }
          />

          <Input
            label="Title"
            value={form.enquirySection?.title}
            onChange={(val) =>
              handleTopLevelChange("enquirySection", "title", val)
            }
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Subtitle"
            value={form.enquirySection?.subtitle}
            onChange={(val) =>
              handleTopLevelChange("enquirySection", "subtitle", val)
            }
          />
        </div>
      </SectionCard>

      <SectionCard title="Why Franchise Section">
        <div className="grid gap-4 xl:grid-cols-2">
          <Input
            label="Heading"
            value={form.whyFranchise?.heading}
            onChange={(val) =>
              handleTopLevelChange("whyFranchise", "heading", val)
            }
          />

          <Input
            label="Title"
            value={form.whyFranchise?.title}
            onChange={(val) =>
              handleTopLevelChange("whyFranchise", "title", val)
            }
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => addArrayItem("whyFranchise", createCardItem())}
            className="inline-flex items-center justify-center rounded-xl bg-[#07111a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b5c8e]"
          >
            Add Card
          </button>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {(form.whyFranchise?.items || []).map((item, index) => (
            <CardBlock key={index} title={`Why Franchise Card ${index + 1}`}>
              <Input
                label="Title"
                value={item.title}
                onChange={(val) =>
                  handleArrayItemChange("whyFranchise", index, "title", val)
                }
              />

              <ImageUploadField
                label="Image"
                value={item.image}
                setUploading={setUploading}
                onChange={(val) =>
                  handleArrayItemChange("whyFranchise", index, "image", val)
                }
              />

              <Textarea
                label="Description"
                value={item.description}
                onChange={(val) =>
                  handleArrayItemChange(
                    "whyFranchise",
                    index,
                    "description",
                    val,
                  )
                }
              />

              <div>
                <button
                  type="button"
                  onClick={() => removeArrayItem("whyFranchise", index)}
                  className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Remove Card
                </button>
              </div>
            </CardBlock>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Brand Stats / Why Multiclout Section">
        <div className="grid gap-4 xl:grid-cols-2">
          <Input
            label="Heading"
            value={form.brandStats?.heading}
            onChange={(val) =>
              handleTopLevelChange("brandStats", "heading", val)
            }
          />

          <Input
            label="Title"
            value={form.brandStats?.title}
            onChange={(val) => handleTopLevelChange("brandStats", "title", val)}
          />
        </div>

        <div className="mt-4">
          <ImageUploadField
            label="Main Image"
            value={form.brandStats?.image}
            setUploading={setUploading}
            onChange={(val) => handleTopLevelChange("brandStats", "image", val)}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() =>
              addArrayItem("brandStats", createCardItem(), "stats")
            }
            className="inline-flex items-center justify-center rounded-xl bg-[#07111a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b5c8e]"
          >
            Add Stat Card
          </button>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {(form.brandStats?.stats || []).map((item, index) => (
            <CardBlock key={index} title={`Brand Stat Card ${index + 1}`}>
              <Input
                label="Title"
                value={item.title}
                onChange={(val) =>
                  handleArrayItemChange(
                    "brandStats",
                    index,
                    "title",
                    val,
                    "stats",
                  )
                }
              />

              <ImageUploadField
                label="Image"
                value={item.image}
                setUploading={setUploading}
                onChange={(val) =>
                  handleArrayItemChange(
                    "brandStats",
                    index,
                    "image",
                    val,
                    "stats",
                  )
                }
              />

              <Textarea
                label="Description"
                value={item.description}
                onChange={(val) =>
                  handleArrayItemChange(
                    "brandStats",
                    index,
                    "description",
                    val,
                    "stats",
                  )
                }
              />

              <div>
                <button
                  type="button"
                  onClick={() => removeArrayItem("brandStats", index, "stats")}
                  className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Remove Stat Card
                </button>
              </div>
            </CardBlock>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Franchise Banner Section">
        <div className="grid gap-4 xl:grid-cols-2">
          <Input
            label="Heading"
            value={form.franchiseBannerSection?.heading}
            onChange={(val) =>
              handleTopLevelChange("franchiseBannerSection", "heading", val)
            }
          />

          <Input
            label="Title"
            value={form.franchiseBannerSection?.title}
            onChange={(val) =>
              handleTopLevelChange("franchiseBannerSection", "title", val)
            }
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Subtitle"
            value={form.franchiseBannerSection?.subtitle}
            onChange={(val) =>
              handleTopLevelChange("franchiseBannerSection", "subtitle", val)
            }
          />
        </div>

        <div className="mt-4">
          <ImageUploadField
            label="Banner Image"
            value={form.franchiseBannerSection?.image}
            onChange={(val) =>
              handleTopLevelChange("franchiseBannerSection", "image", val)
            }
            setUploading={setUploading}
          />
        </div>
      </SectionCard>

      <SectionCard title="Facts Section">
        <div className="grid gap-4 xl:grid-cols-2">
          <Input
            label="Heading"
            value={form.factsSection?.heading}
            onChange={(val) =>
              handleTopLevelChange("factsSection", "heading", val)
            }
          />

          <ImageUploadField
            label="Background Image"
            value={form.factsSection?.backgroundImage}
            onChange={(val) =>
              handleTopLevelChange("factsSection", "backgroundImage", val)
            }
            setUploading={setUploading}
          />
        </div>

        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-[#07111a]">
              Facts Stats
            </h3>
            <button
              type="button"
              onClick={() =>
                addArrayItem("factsSection", createStatItem(), "stats")
              }
              className="inline-flex items-center justify-center rounded-xl bg-[#07111a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b5c8e]"
            >
              Add Stat
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {(form.factsSection?.stats || []).map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
              >
                <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
                  <Input
                    label="Label"
                    value={item.label}
                    onChange={(val) =>
                      handleArrayItemChange(
                        "factsSection",
                        index,
                        "label",
                        val,
                        "stats",
                      )
                    }
                  />

                  <Input
                    label="Value"
                    value={item.value}
                    onChange={(val) =>
                      handleArrayItemChange(
                        "factsSection",
                        index,
                        "value",
                        val,
                        "stats",
                      )
                    }
                  />

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem("factsSection", index, "stats")
                      }
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-red-500 px-4 text-sm font-medium text-white transition hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Founder Section">
        <div className="grid gap-4 xl:grid-cols-2">
          <Input
            label="Heading"
            value={form.founder?.heading}
            onChange={(val) => handleTopLevelChange("founder", "heading", val)}
          />

          <Input
            label="Founder Name"
            value={form.founder?.name}
            onChange={(val) => handleTopLevelChange("founder", "name", val)}
          />

          <Input
            label="Designation"
            value={form.founder?.designation}
            onChange={(val) =>
              handleTopLevelChange("founder", "designation", val)
            }
          />
        </div>

        <div className="mt-4">
          <ImageUploadField
            label="Founder Image"
            value={form.founder?.image}
            onChange={(val) => handleTopLevelChange("founder", "image", val)}
            setUploading={setUploading}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Message"
            rows={6}
            value={form.founder?.message}
            onChange={(val) => handleTopLevelChange("founder", "message", val)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Ideal Partner Section">
        <div className="grid gap-4 xl:grid-cols-2">
          <Input
            label="Heading"
            value={form.idealPartner?.heading}
            onChange={(val) =>
              handleTopLevelChange("idealPartner", "heading", val)
            }
          />

          <Input
            label="Title"
            value={form.idealPartner?.title}
            onChange={(val) =>
              handleTopLevelChange("idealPartner", "title", val)
            }
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => addArrayItem("idealPartner", createCardItem())}
            className="inline-flex items-center justify-center rounded-xl bg-[#07111a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b5c8e]"
          >
            Add Card
          </button>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {(form.idealPartner?.items || []).map((item, index) => (
            <CardBlock key={index} title={`Ideal Partner Card ${index + 1}`}>
              <Input
                label="Title"
                value={item.title}
                onChange={(val) =>
                  handleArrayItemChange("idealPartner", index, "title", val)
                }
              />

              <ImageUploadField
                label="Image"
                value={item.image}
                onChange={(val) =>
                  handleArrayItemChange("idealPartner", index, "image", val)
                }
                setUploading={setUploading}
              />

              <Textarea
                label="Description"
                value={item.description}
                onChange={(val) =>
                  handleArrayItemChange(
                    "idealPartner",
                    index,
                    "description",
                    val,
                  )
                }
              />

              <div>
                <button
                  type="button"
                  onClick={() => removeArrayItem("idealPartner", index)}
                  className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Remove Card
                </button>
              </div>
            </CardBlock>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Delivery Modes Section">
        <div className="grid gap-4 xl:grid-cols-2">
          <Input
            label="Heading"
            value={form.deliveryModes?.heading}
            onChange={(val) =>
              handleTopLevelChange("deliveryModes", "heading", val)
            }
          />

          <Input
            label="Title"
            value={form.deliveryModes?.title}
            onChange={(val) =>
              handleTopLevelChange("deliveryModes", "title", val)
            }
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => addArrayItem("deliveryModes", createCardItem())}
            className="inline-flex items-center justify-center rounded-xl bg-[#07111a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b5c8e]"
          >
            Add Delivery Mode
          </button>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {(form.deliveryModes?.items || []).map((item, index) => (
            <CardBlock key={index} title={`Delivery Mode ${index + 1}`}>
              <Input
                label="Title"
                value={item.title}
                onChange={(val) =>
                  handleArrayItemChange("deliveryModes", index, "title", val)
                }
              />

              <ImageUploadField
                label="Image"
                value={item.image}
                onChange={(val) =>
                  handleArrayItemChange("deliveryModes", index, "image", val)
                }
                setUploading={setUploading}
              />

              <Textarea
                label="Description"
                value={item.description}
                onChange={(val) =>
                  handleArrayItemChange(
                    "deliveryModes",
                    index,
                    "description",
                    val,
                  )
                }
              />

              <div>
                <button
                  type="button"
                  onClick={() => removeArrayItem("deliveryModes", index)}
                  className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Remove Mode
                </button>
              </div>
            </CardBlock>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Support System Section">
        <div className="grid gap-4 xl:grid-cols-2">
          <Input
            label="Heading"
            value={form.supportSystem?.heading}
            onChange={(val) =>
              handleTopLevelChange("supportSystem", "heading", val)
            }
          />

          <Input
            label="Title"
            value={form.supportSystem?.title}
            onChange={(val) =>
              handleTopLevelChange("supportSystem", "title", val)
            }
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => addArrayItem("supportSystem", createCardItem())}
            className="inline-flex items-center justify-center rounded-xl bg-[#07111a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b5c8e]"
          >
            Add Support Card
          </button>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {(form.supportSystem?.items || []).map((item, index) => (
            <CardBlock key={index} title={`Support Card ${index + 1}`}>
              <Input
                label="Title"
                value={item.title}
                onChange={(val) =>
                  handleArrayItemChange("supportSystem", index, "title", val)
                }
              />

              <ImageUploadField
                label="Image"
                value={item.image}
                onChange={(val) =>
                  handleArrayItemChange("supportSystem", index, "image", val)
                }
                setUploading={setUploading}
              />

              <Textarea
                label="Description"
                value={item.description}
                onChange={(val) =>
                  handleArrayItemChange(
                    "supportSystem",
                    index,
                    "description",
                    val,
                  )
                }
              />

              <div>
                <button
                  type="button"
                  onClick={() => removeArrayItem("supportSystem", index)}
                  className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Remove Support Card
                </button>
              </div>
            </CardBlock>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Process Section">
        <div className="grid gap-4 xl:grid-cols-2">
          <Input
            label="Heading"
            value={form.processSection?.heading}
            onChange={(val) =>
              handleTopLevelChange("processSection", "heading", val)
            }
          />

          <Input
            label="Title"
            value={form.processSection?.title}
            onChange={(val) =>
              handleTopLevelChange("processSection", "title", val)
            }
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => addArrayItem("processSection", createProcessItem())}
            className="inline-flex items-center justify-center rounded-xl bg-[#07111a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b5c8e]"
          >
            Add Step
          </button>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {(form.processSection?.items || []).map((item, index) => (
            <CardBlock key={index} title={`Process Step ${index + 1}`}>
              <div className="grid gap-4 lg:grid-cols-2">
                <Input
                  label="Step Number"
                  value={item.step}
                  onChange={(val) =>
                    handleArrayItemChange("processSection", index, "step", val)
                  }
                />

                <Input
                  label="Title"
                  value={item.title}
                  onChange={(val) =>
                    handleArrayItemChange("processSection", index, "title", val)
                  }
                />
              </div>

              <Textarea
                label="Description"
                value={item.description}
                onChange={(val) =>
                  handleArrayItemChange(
                    "processSection",
                    index,
                    "description",
                    val,
                  )
                }
              />

              <div>
                <button
                  type="button"
                  onClick={() => removeArrayItem("processSection", index)}
                  className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Remove Step
                </button>
              </div>
            </CardBlock>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Video Section">
        <div className="grid gap-4 xl:grid-cols-2">
          <Input
            label="Heading"
            value={form.videoSection?.heading}
            onChange={(val) =>
              handleTopLevelChange("videoSection", "heading", val)
            }
          />

          <Input
            label="Title"
            value={form.videoSection?.title}
            onChange={(val) =>
              handleTopLevelChange("videoSection", "title", val)
            }
          />

          <Input
            label="YouTube URL"
            value={form.videoSection?.youtubeUrl}
            onChange={(val) =>
              handleTopLevelChange("videoSection", "youtubeUrl", val)
            }
          />
        </div>

        <div className="mt-4">
          <ImageUploadField
            label="Thumbnail"
            value={form.videoSection?.thumbnail}
            onChange={(val) =>
              handleTopLevelChange("videoSection", "thumbnail", val)
            }
            setUploading={setUploading}
          />
        </div>
      </SectionCard>

      <SectionCard title="Logos Section">
        <div className="grid gap-4 xl:grid-cols-2">
          <Input
            label="Heading"
            value={form.logosSection?.heading}
            onChange={(val) =>
              handleTopLevelChange("logosSection", "heading", val)
            }
          />

          <Input
            label="Title"
            value={form.logosSection?.title}
            onChange={(val) =>
              handleTopLevelChange("logosSection", "title", val)
            }
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={addLogo}
            className="inline-flex items-center justify-center rounded-xl bg-[#07111a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b5c8e]"
          >
            Add Logo
          </button>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {(form.logosSection?.logos || []).map((logo, index) => (
            <CardBlock key={index} title={`Logo ${index + 1}`}>
              <ImageUploadField
                label={`Logo ${index + 1}`}
                value={logo}
                onChange={(val) => handleLogoChange(index, val)}
                setUploading={setUploading}
              />

              <div>
                <button
                  type="button"
                  onClick={() => removeLogo(index)}
                  className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Remove Logo
                </button>
              </div>
            </CardBlock>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export default FranchiseAdmin;

function SectionCard({ title, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 md:px-5">
        <h2 className="text-lg font-semibold text-[#07111a] md:text-xl">
          {title}
        </h2>
      </div>

      <div className="p-4 md:p-5">{children}</div>
    </section>
  );
}

function CardBlock({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-[#07111a]">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder = "" }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#07111a]">
        {label}
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3, placeholder = "" }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#07111a]">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[110px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
      />
    </div>
  );
}

function ImageUploadField({
  label,
  value,
  onChange,
  setUploading,
  placeholder = "/uploads/example.jpg",
}) {
  const [localUploading, setLocalUploading] = useState(false);

  const previewSrc = (() => {
    if (!value) return "";

    // full url
    if (value.startsWith("http")) {
      return value;
    }

    // uploads folder
    if (value.startsWith("/uploads")) {
      return `${API_HOST}${value}`;
    }

    // normal path
    return `${API_HOST}/${value.replace(/^\/+/, "")}`;
  })();

 const handleFileUpload = async (e) => {
  try {
    setLocalUploading(true);

if (setUploading) {
  setUploading(true);
}

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("adminToken");

    const res = await fetch(`${API}/upload`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

    const contentType = res.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Non JSON Response:", text);
      alert("Server returned invalid response");
      return;
    }

    const result = await res.json();

    if (result.success) {
      onChange(result.image);
    } else {
      alert(result.message || "Upload failed");
    }
  } catch (error) {
    console.error(error);
    alert("Image upload failed");
  } finally {
  setLocalUploading(false);

  if (setUploading) {
    setUploading(false);
  }
}
};

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#07111a]">
        {label}
      </label>

      <div className="rounded-2xl border border-slate-300 bg-white p-3">
        <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {previewSrc ? (
              <img
                src={previewSrc}
                alt={label}
                className="h-[150px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[150px] items-center justify-center px-4 text-center text-sm text-slate-400">
                No image selected
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] outline-none transition focus:border-[#167a7a] focus:ring-2 focus:ring-[#167a7a]/10"
            />

            <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-[#07111a] px-4 text-sm font-medium text-white transition hover:bg-[#0b5c8e] md:w-fit">
              {localUploading ? "Uploading..." : "Choose Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            {value ? (
              <p className="truncate text-xs text-slate-500">{value}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
