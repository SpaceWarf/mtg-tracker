import "@assets/styles/Rewind.scss";
import { Heading } from "@radix-ui/themes";

export function RewindPage7() {
  return (
    <div className="Page7 w-full h-full">
      <Heading
        className="RewindHeading Heading1 w-full"
        align="center"
        size="7"
      >
        We're blessed to have a player like you in our pod.
      </Heading>
      <Heading
        className="RewindHeading Heading2 w-full"
        align="center"
        size="7"
      >
        We've had a lot of fun this year,
      </Heading>
      <Heading
        className="RewindHeading Heading3 w-full"
        align="center"
        size="7"
      >
        Let's have even more in the next one.
      </Heading>
      <div className="RewindHeading Heading4 w-full">
        <Heading align="center" size="7">
          Enjoy the Holidays, and have a wonderful New Year!
        </Heading>
        <Heading className="mt-10 mr-24" align="right" size="7">
          - Gabriel
        </Heading>
      </div>
    </div>
  );
}
