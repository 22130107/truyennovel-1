/**
 * Parse HTML từ mammoth.convertToHtml() thành plain text
 * giữ nguyên cấu trúc đoạn văn từ file Word.
 *
 * Word thường dùng:
 * - <p>...</p>  → đoạn văn (cách nhau 1 dòng trống)
 * - <br />      → xuống dòng trong cùng đoạn (cũng tách thành đoạn riêng)
 */
export function parseWordHtmlToText(html: string): string {
  if (typeof document === "undefined") return html;

  const div = document.createElement("div");
  div.innerHTML = html;

  const paragraphs: string[] = [];

  // Duyệt từng <p>
  const pElements = div.querySelectorAll("p");
  pElements.forEach((p) => {
    // Thay <br> thành ký tự đặc biệt để tách sau
    p.querySelectorAll("br").forEach((br) => {
      br.replaceWith("\x00"); // dùng null char làm marker
    });

    const text = p.textContent ?? "";
    // Tách tại marker, trim, bỏ dòng trống
    const lines = text
      .split("\x00")
      .map((s) => s.trim())
      .filter(Boolean);

    paragraphs.push(...lines);
  });

  // Join bằng \n\n để có dòng trống giữa các đoạn
  return paragraphs.join("\n\n");
}
