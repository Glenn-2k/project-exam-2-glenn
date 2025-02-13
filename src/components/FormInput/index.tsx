interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  type?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
}) => {
  return (
    <div>
      <label className="block text-gray-700">{label}</label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded-md h-24"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded-md"
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;
