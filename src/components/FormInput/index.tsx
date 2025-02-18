/**
 * Interface for the FormInput component props.
 *
 * @interface FormInputProps
 * @property {string} label - The text label associated with the input field.
 * @property {string} name - The name attribute of the input field.
 * @property {string} value - The current value of the input field.
 * @property {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} onChange - Function to handle input changes.
 * @property {string} [error] - Optional error message displayed below the input field.
 * @property {string} [type] - Input type (e.g., "text", "number", "email"). Defaults to "text". If "textarea" is specified, a textarea element is rendered instead.
 */
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

/**
 * FormInput Component
 *
 * A reusable input component that dynamically renders either an input field or a textarea based on the `type` prop.
 *
 * @component
 * @param {FormInputProps} props - Component props.
 * @returns {JSX.Element} The rendered input or textarea element.
 */
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
      <label htmlFor={name} className="block text-gray-700">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded-md h-24"
        />
      ) : (
        <input
          id={name}
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
