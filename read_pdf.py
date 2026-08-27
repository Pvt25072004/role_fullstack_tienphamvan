import PyPDF2
import sys

def extract_text(pdf_path):
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    with open("pdf_output.txt", "w", encoding="utf-8") as out_file:
        out_file.write(text)

if __name__ == "__main__":
    extract_text(sys.argv[1])
