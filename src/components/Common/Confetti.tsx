import "../../assets/styles/Confetti.scss";

export function Confetti() {
  return (
    <div className="confettis">
      {Array(30).fill(<div className="confetti" />)}
    </div>
  );
}
