from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

def create_dummy_fra_pdf(output_file="fra_dummy.pdf"):
    c = canvas.Canvas(output_file, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica", 12)

    # Add dummy FRA details
    c.drawString(100, height - 100, "Forest Rights Act (FRA) Claim Form")
    c.drawString(100, height - 140, "Name of Claimant: Ramesh Kumar")
    c.drawString(100, height - 160, "Village: Bhimapur")
    c.drawString(100, height - 180, "District: Gadchiroli")
    c.drawString(100, height - 200, "State: Maharashtra")
    c.drawString(100, height - 220, "Claim Type: IFR")
    c.drawString(100, height - 240, "Status: Approved")
    c.drawString(100, height - 260, "Coordinates: 20.1234, 79.1234")

    # Add footer
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(100, 100, "Dummy FRA PDF generated for prototype testing.")

    c.save()
    print(f"[✅] Dummy FRA PDF created: {output_file}")

if __name__ == "__main__":
    create_dummy_fra_pdf(r"c:\Users\dania\Documents\My_Repositories\Private\FRA-GIS\OCR\fra_dummy.pdf")
