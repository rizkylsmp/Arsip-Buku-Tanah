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
  const [activeComboboxKey, setActiveComboboxKey] = React.useState(null);

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

  const getFieldKey = (item) => item.fieldKey || labelToKey(item.label);

  const getOptionLabel = (option) => String(option.label ?? option.value);

  const handleInputChange = (e, item) => {
    const fieldKey = getFieldKey(item);
    const value = e.target.value;
    setFormData((prev) => {
      const next = { ...prev, [fieldKey]: value };

      item.resetFieldsOnChange?.forEach((key) => {
        next[key] = "";
      });

      return { ...next, ...(item.onValueChange?.(value, next, prev) || {}) };
    });
  };

  const updateComboboxValue = (item, typedValue, selectedOption) => {
    const fieldKey = getFieldKey(item);
    const displayKey = item.displayKey || `${fieldKey}Label`;

    setFormData((prev) => {
      const next = {
        ...prev,
        [displayKey]: typedValue,
        [fieldKey]: selectedOption?.value || "",
      };

      item.resetFieldsOnChange?.forEach((key) => {
        next[key] = "";
      });

      return {
        ...next,
        ...(item.onValueChange?.(
          selectedOption?.value || "",
          next,
          prev,
          typedValue
        ) || {}),
      };
    });
  };

  const handleComboboxChange = (e, item) => {
    const typedValue = e.target.value;
    const selectedOption = item.options?.find(
      (opt) => getOptionLabel(opt).toLowerCase() === typedValue.toLowerCase()
    );

    updateComboboxValue(item, typedValue, selectedOption);
  };

  const renderField = (item) => {
    const fieldKey = getFieldKey(item);
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
          value={formData[fieldKey] ?? ""}
          onChange={(e) => handleInputChange(e, item)}
          disabled={isDisabled}
        >
          <option value="">{item.placeholder || `Pilih ${item.label}`}</option>
          {item.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (item.type === "combobox") {
      const displayKey = item.displayKey || `${fieldKey}Label`;
      const selectedOption = item.options?.find(
        (opt) => String(opt.value) === String(formData[fieldKey] ?? "")
      );
      const inputValue =
        formData[displayKey] ?? (selectedOption ? getOptionLabel(selectedOption) : "");
      const filteredOptions = (item.options || [])
        .filter((opt) =>
          getOptionLabel(opt).toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, item.maxVisibleOptions || 10);
      const isComboboxOpen = activeComboboxKey === displayKey && !isDisabled;
      const chooseOption = (option) => {
        updateComboboxValue(item, getOptionLabel(option), option);
        setActiveComboboxKey(null);
      };

      return (
        <div className="relative w-full">
          <input
            name={displayKey}
            id={displayKey}
            className={`${commonClasses} pr-9`}
            type="text"
            required={item.required ?? true}
            placeholder={item.placeholder || `Pilih ${item.label}`}
            autoComplete="off"
            value={inputValue}
            onFocus={() => setActiveComboboxKey(displayKey)}
            onChange={(e) => {
              setActiveComboboxKey(displayKey);
              handleComboboxChange(e, item);
            }}
            onBlur={() => setActiveComboboxKey(null)}
            disabled={isDisabled}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            v
          </span>
          {isComboboxOpen && (
            <div className="absolute z-[200] mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-blue-100 bg-white py-1 shadow-xl ring-1 ring-black/5">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected =
                    String(opt.value) === String(formData[fieldKey] ?? "");

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors ${
                        isSelected
                          ? "bg-blue-50 font-semibold text-blue-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        chooseOption(opt);
                      }}
                    >
                      <span className="truncate">{getOptionLabel(opt)}</span>
                      {isSelected && (
                        <span className="shrink-0 text-xs text-blue-600">
                          Dipilih
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-sm text-slate-500">
                  Tidak ada data
                </div>
              )}
            </div>
          )}
        </div>
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
          value={formData[fieldKey] ?? ""}
          onChange={(e) => handleInputChange(e, item)}
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
        value={formData[fieldKey] ?? ""}
        onChange={(e) => handleInputChange(e, item)}
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
        className="mt-6 py-3 w-full cursor-pointer text-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold leading-none text-white shadow-md hover:shadow-lg transition-all text-sm md:text-base"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default Form;
