interface OpenInvitationButtonProps {
  label?: string;
  onClick: () => void;
  className?: string;
}

export function OpenInvitationButton({
  label = "Open invitation",
  onClick,
  className = "",
}: OpenInvitationButtonProps) {
  return (
    <button type="button" className={`btn ${className}`.trim()} onClick={onClick}>
      {label}
    </button>
  );
}
