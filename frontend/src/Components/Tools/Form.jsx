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
    const parts = label.toLowerCase().split(/\s+/);
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
        >
          <input type="text" name="__fake_username" autoComplete="username" />
          <input
            type="password"
            name="__fake_password"
            autoComplete="new-password"
          />
        </div>
      )}
      <div className="mb-3 grid flex-col gap-4">
        {fields.map((item, index) => (
          <div key={index} className="flex gap-5">
            <div className="w-1/5">
              <label className="text-md">{item.label}</label>
            </div>
            <div className="w-4/5">
              <input
                name={labelToKey(item.label)}
                id={labelToKey(item.label)}
                className="box-border inline-flex h-8 w-full appearance-none rounded px-2.5 text-sm leading-none shadow-[0_0_0_1px] shadow-abu outline-none selection:bg-blackA6 selection:text-black hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                type={item.type}
                required={item.required ?? true}
                placeholder={"Masukan " + item.label}
                autoComplete={
                  item.autocomplete ?? (disableAutofill ? "off" : undefined)
                }
                value={formData[labelToKey(item.label)]}
                onChange={(e) => handleInputChange(e, item.label)}
                disabled={disabledFields.includes(labelToKey(item.label))}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="mt-5 py-3 w-full text-center rounded bg-biru-terang font-medium leading-none text-white hover:bg-biru"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default Form;
