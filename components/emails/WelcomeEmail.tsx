import * as React from "react";
import { Html, Head, Body, Container, Text } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface WelcomeEmailProps {
  fullName: string;
}

const WelcomeEmail = ({ fullName }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white text-dark-500 font-ibm-plex-sans">
          <Container className="p-6 max-w-lg mx-auto border border-gray-100 rounded-lg shadow-lg">
            <Text className="text-2xl font-bold text-dark-600">
              Welcome to Our Library 📚
            </Text>
            <Text className="text-lg text-dark-500">
              Hello {fullName}, we are excited to have you here!
            </Text>
            <Text className="text-sm text-gray-500 mt-4">
              Explore our collection, borrow books, and enjoy reading!
            </Text>
            <Text className="mt-6 text-dark-400 text-sm">
              Happy reading,
              <br /> The Library Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
