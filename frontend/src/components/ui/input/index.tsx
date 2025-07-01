interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChangeValue?: (value: string) => void;
}

export function Input({
  type = "text",
  value,
  onChangeValue,
  placeholder = "",
  disabled = false,
  className = "",
  ...rest
}: Props) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChangeValue && onChangeValue(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`border rounded p-2 w-full ${className}`}
      {...rest}
    />
  );
}
