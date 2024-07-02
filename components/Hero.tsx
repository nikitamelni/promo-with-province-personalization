import { RichTextParamValue } from "@uniformdev/canvas";
import { UniformRichText } from "@uniformdev/canvas-next";
import {
  registerUniformComponent,
  ComponentProps,
  UniformText,
} from "@uniformdev/canvas-react";
import Link from "next/link";
import { useRouter } from "next/router";

type EligibleProvinces = [
  { fields: { code: { value: string } }; name: { value: string } }
];

type HeroProps = ComponentProps<{
  title: string;
  description?: RichTextParamValue;
  eligibleProvinces?: EligibleProvinces;
}>;

const Hero: React.FC<HeroProps> = (props: HeroProps) => {
  console.log("eligibleProvinces", props.eligibleProvinces);
  const { eligibleProvinces } = props;
  const router = useRouter();
  const selectedProvinceFromQueryString = router.query.selected_province;
  console.log(
    "selectedProvinceFromQueryString",
    selectedProvinceFromQueryString
  );
  eligibleProvinces.forEach((p) => {
    console.log("log from foreach", p.fields?.code?.value);
  });
  const isSelectedProvinceEdligible = eligibleProvinces.some(
    (p) => p.fields?.code?.value === selectedProvinceFromQueryString
  );
  return (
    <>
      Should be displayed: {isSelectedProvinceEdligible ? "Yes" : "No"}
      {isSelectedProvinceEdligible ? (
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
          <Link href="/campaign">Static link</Link>
          <h3>Is selected province edligible? </h3>
        </div>
      ) : null}
    </>
  );
};

registerUniformComponent({
  type: "hero",
  component: Hero,
});

export default Hero;
