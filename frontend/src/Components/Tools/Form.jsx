import React from "react";

const Form = ({
  fields,
  onSubmit,
  formData,
  setFormData,
  disableAutofill = true,
  disabledFields = [],
  buttonText = "Simpan",
}) => {
  const labelToKey = (label) => {
    const parts = label
      .toLowerCase()
      .trim()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);

    if (parts.length === 0) return "";

    return (
      parts[0] +
      parts
        .slice(1)
        .map((p) => p[0].toUpperCase() + p.slice(1))
        .join("")
    );
  };

  const handleInputChange = (e, label) => {
    const fieldKey = labelToKey(label);
    setFormData((prev) => ({ ...prev, [fieldKey]: e.target.value }));
  };

  const renderField = (item) => {
    const fieldKey = labelToKey(item.label);
    const isDisabled = disabledFields.includes(fieldKey) || item.disabled;
    const commonClasses =
      "box-border inline-flex w-full appearance-none rounded-lg px-3 py-2 text-sm leading-none border-2 border-slate-200 outline-none bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 shadow-sm";

    if (item.type === "select") {
      return (
        <select
          name={fieldKey}
          id={fieldKey}
          className={`${commonClasses}`}
          required={item.required ?? true}
          value={formData[fieldKey]}
          onChange={(e) => handleInputChange(e, item.label)}
          disabled={isDisabled}
        >
          <option value="">Pilih {item.label}</option>
          {item.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (item.type === "textarea") {
      return (
        <textarea
          name={fieldKey}
          id={fieldKey}
          className={`${commonClasses} min-h-24 resize-y`}
          required={item.required ?? true}
          placeholder={"Masukan " + item.label}
          value={formData[fieldKey]}
          onChange={(e) => handleInputChange(e, item.label)}
          disabled={isDisabled}
        />
      );
    }

    return (
      <input
        name={fieldKey}
        id={fieldKey}
        className={`${commonClasses}`}
        type={item.type}
        required={item.required ?? true}
        placeholder={"Masukan " + item.label}
        autoComplete={
          item.autocomplete ?? (disableAutofill ? "off" : undefined)
        }
        value={formData[fieldKey]}
        onChange={(e) => handleInputChange(e, item.label)}
        disabled={isDisabled}
      />
    );
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full"
      autoComplete={disableAutofill ? "off" : undefined}
    >
      {/* Dummy hidden inputs to reduce browser autofill for username/password */}
      {disableAutofill && (
        <div
          style={{
            position: "absolute",
            left: -9999,
            width: 1,
            height: 1,
            overflow: "hidden",
          }}
          aria-hidden
        ></div>
      )}
      <div className="mb-3 grid flex-col gap-3 md:gap-4">
        {fields.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-2 md:gap-5">
            <div className="w-full md:w-1/5">
              <label className="text-sm md:text-base font-semibold text-gray-700">
                {item.label}
              </label>
            </div>
            <div className="w-full md:w-4/5">{renderField(item)}</div>
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="mt-6 py-3 w-full text-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold leading-none text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all text-sm md:text-base"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default Form;
