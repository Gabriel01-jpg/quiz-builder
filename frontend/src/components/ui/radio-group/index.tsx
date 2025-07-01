export function RadioGroup({ children }: { children?: React.ReactNode }) {
  return <fieldset className="flex flex-col space-y-2">{children}</fieldset>;
}

interface RadioGroupItemProps {
  value: string;
  checked?: boolean;
  onCheckedChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export function RadioGroupItem({
  value,
  checked,
  onCheckedChange,
  name = "radio-group",
  disabled = false,
  id = `radio-${value.replace(/\s+/g, "-")}`,
}: RadioGroupItemProps) {
  return (
    <input
      id={id}
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onCheckedChange(value)}
      disabled={disabled}
    />
  );
}
