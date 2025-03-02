import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
} from "@react-email/components";

export default function EmailTemplate({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>We miss you, {name}!</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <Container>
          <Heading>Hey {name}, we miss you! 🥰🥰</Heading>
          <Text>
            It's been a while since you've logged in. Come back and explore more
            books! 📚
          </Text>
          <Button
            href="https://book-store-rho-woad.vercel.app/"
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              padding: "10px 15px",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            Log Back In
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
