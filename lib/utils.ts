import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part)
    .join(" ")
    .toUpperCase()
    .slice(0, 2);

export const formatDate = (date: Date | string | null): string => {
  if (!date) return "N/A";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "Invalid Date";

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const generateReceiptPDF = async (
  element: HTMLElement,
  filename: string,
) => {
  if (!element) return false;

  try {
    // Step 1: Get high-quality canvas of the receipt
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#1e293b",
      logging: false,
      // Don't set width/height to avoid scaling issues
    });

    // Step 2: Create a PDF with custom dimensions to fit the receipt
    // Calculate the optimal PDF size with a fixed width and appropriate height
    const pdfWidth = 210; // Standard A4 width in mm
    const pdfHeight = 297; // Standard A4 height in mm
    const margin = 10; // Margins in mm

    // Calculate available space and scale
    const availableWidth = pdfWidth - margin * 2;
    const availableHeight = pdfHeight - margin * 2;

    // Calculate image dimensions while maintaining aspect ratio
    const aspectRatio = canvas.height / canvas.width;
    let imgWidth = availableWidth;
    let imgHeight = imgWidth * aspectRatio;

    // If image is too tall, scale it down to fit the page
    if (imgHeight > availableHeight) {
      imgHeight = availableHeight;
      imgWidth = imgHeight / aspectRatio;
    }

    // Create PDF with fixed dimensions
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    // Calculate centering offsets
    const xOffset = margin + (availableWidth - imgWidth) / 2;
    const yOffset = margin + (availableHeight - imgHeight) / 2;

    // Add the image to PDF
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      xOffset,
      yOffset,
      imgWidth,
      imgHeight,
    );

    // Save the PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
