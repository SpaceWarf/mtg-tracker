import "../../assets/styles/Confetti.scss";

export function Confetti() {
  return (
    <div className="confettis">
      {Array(30)
        .fill(0)
        .map((_, index) => (
          <div className="confetti" key={index} />
        ))}
    </div>
  );
}
