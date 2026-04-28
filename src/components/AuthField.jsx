export default function AuthField({
  label,
  type,
  placeholder,
  value,
  onChange,
  onKeyDown,
}) {
  return (
    <div className="auth-field">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
