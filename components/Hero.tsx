import { RichTextParamValue } from "@uniformdev/canvas";
import { UniformRichText } from "@uniformdev/canvas-next";
import {
  registerUniformComponent,
  ComponentProps,
  UniformText,
} from "@uniformdev/canvas-react";
import Link from "next/link";

type HeroProps = ComponentProps<{
  title: string;
  description?: RichTextParamValue;
}>;

const Hero: React.FC<HeroProps> = () => (
  <div>
    <UniformText
      className="title"
      parameterId="title"
      as="h1"
      data-test-id="hero-title"
      placeholder="Hero title goes here"
    />
    <UniformRichText
      parameterId="description"
      className="description"
      data-test-id="hero-description"
    />
    <Link href="/campaign">
      Static link
    </Link>
  </div>
);

registerUniformComponent({
  type: "hero",
  component: Hero,
});

export default Hero;
