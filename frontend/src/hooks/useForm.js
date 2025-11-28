import { useState } from "react";

export const useForm = (initialValues = {}) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = (newValues = initialValues) => {
    setFormValues(newValues);
  };

  return {
    formValues,
    handleInputChange,
    resetForm,
  };
};
