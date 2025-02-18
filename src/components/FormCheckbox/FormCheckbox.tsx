/**
 * Interface for the FormCheckbox component props.
 *
 * @interface FormCheckboxProps
 * @property {string} label - The text label displayed next to the checkbox.
 * @property {string} name - The name attribute of the checkbox input.
 * @property {boolean} checked - Boolean value indicating whether the checkbox is checked.
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} onChange - Function to handle checkbox state changes.
 */
interface FormCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * FormCheckbox Component
 *
 * A reusable checkbox input component with a label.
 *
 * @component
 * @param {FormCheckboxProps} props - Component props.
 * @returns {JSX.Element} The rendered checkbox input.
 */
const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  name,
  checked,
  onChange,
}) => (
  <label htmlFor={name} className="flex items-center space-x-2">
    <input
      id={name}
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4"
    />
    <span className="text-sm text-gray-600">{label}</span>
  </label>
);

export default FormCheckbox;
