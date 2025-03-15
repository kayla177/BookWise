// // components/emails/EmailLayout.tsx
// import * as React from "react";
// import {
//   Html,
//   Head,
//   Body,
//   Container,
//   Text,
//   Section,
//   Img,
//   Hr,
// } from "@react-email/components";
// import { Tailwind } from "@react-email/tailwind";
//
// interface EmailLayoutProps {
//   title: string;
//   children: React.ReactNode;
//   previewText?: string;
// }
//
// const EmailLayout = ({ title, children, previewText }: EmailLayoutProps) => {
//   return (
//     <Html>
//       <Head>
//         {previewText && <meta name="description" content={previewText} />}
//       </Head>
//       <Tailwind>
//         <Body className="bg-dark-100 text-light-100 font-ibm-plex-sans m-0 p-0">
//           <Container className="max-w-xl mx-auto">
//             <Section className="bg-dark-300 rounded-lg p-8 mt-8 mb-8">
//               {/* Logo */}
//               <div className="flex items-center mb-8">
//                 <Img
//                   src="https://i.ibb.co/kJkwWZT/book-icon.png"
//                   width="32"
//                   height="32"
//                   alt="BookWise Logo"
//                   className="mr-2"
//                 />
//                 <Text className="text-xl font-semibold text-white m-0">
//                   BookWise
//                 </Text>
//               </div>
//
//               <Hr className="border-dark-600 my-6" />
//
//               {/* Title */}
//               <Text className="text-2xl font-semibold text-white mb-4">
//                 {title}
//               </Text>
//
//               {/* Content */}
//               <div className="text-light-100">{children}</div>
//
//               <Hr className="border-dark-600 my-6" />
//
//               {/* Footer */}
//               <Text className="text-light-500 text-sm">
//                 Happy reading,
//                 <br />
//                 The BookWise Team
//               </Text>
//             </Section>
//           </Container>
//         </Body>
//       </Tailwind>
//     </Html>
//   );
// };
//
// export default EmailLayout;

// components/emails/EmailLayout.tsx
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
          {/* Logo */}
          <Section style={{ textAlign: "center", marginBottom: "16px" }}>
            <Img
              src="https://i.ibb.co/kJkwWZT/book-icon.png"
              width="32"
              height="32"
              alt="BookWise Logo"
            />
            <Text
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#ffffff",
                margin: "10px 0 0 0",
              }}
            >
              BookWise
            </Text>
          </Section>

          <Hr style={{ borderColor: "#475569", margin: "20px 0" }} />

          {/* Title */}
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#ffffff",
              marginBottom: "16px",
            }}
          >
            {title}
          </Text>

          {/* Content */}
          <div style={{ color: "#e2e8f0" }}>{children}</div>

          <Hr style={{ borderColor: "#475569", margin: "20px 0" }} />

          {/* Footer */}
          <Text
            style={{ fontSize: "14px", color: "#94a3b8", textAlign: "center" }}
          >
            Happy reading,
            <br />
            The BookWise Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailLayout;
