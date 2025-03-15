import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Img,
  Hr,
} from "@react-email/components";

interface EmailLayoutProps {
  title: string;
  children: React.ReactNode;
  previewText?: string;
}

const EmailLayout = ({ title, children, previewText }: EmailLayoutProps) => {
  return (
    <Html>
      <Head>
        {previewText && <meta name="description" content={previewText} />}
      </Head>
      <Body
        style={{
          backgroundColor: "#1e293b",
          color: "#f8fafc",
          fontFamily: "Arial, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#334155",
            borderRadius: "8px",
          }}
        >
          <Section style={{ textAlign: "center", marginBottom: "15px" }}>
            <Img
              src="https://u.cubeupload.com/kayla_123/Frame147.png"
              width="170"
              height="29"
              alt="BookWise Logo"
            />
            {/*<Text*/}
            {/*  style={{*/}
            {/*    fontSize: "20px",*/}
            {/*    fontWeight: "bold",*/}
            {/*    color: "#ffffff",*/}
            {/*    margin: "10px 0 0 0",*/}
            {/*  }}*/}
            {/*>*/}
            {/*  BookWise*/}
            {/*</Text>*/}
          </Section>

          <Hr style={{ borderColor: "#475569", margin: "20px 0" }} />

          <Text
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#ffffff",
              marginBottom: "16px",
            }}
          >
            {title}
          </Text>

          <div style={{ color: "#e2e8f0" }}>{children}</div>

          {/*<Hr style={{ borderColor: "#475569", margin: "20px 0" }} />*/}

          {/*<Text*/}
          {/*  style={{ fontSize: "14px", color: "#94a3b8", textAlign: "center" }}*/}
          {/*>*/}
          {/*  Happy reading,*/}
          {/*  <br />*/}
          {/*  The BookWise Team*/}
          {/*</Text>*/}
        </Container>
      </Body>
    </Html>
  );
};

export default EmailLayout;
