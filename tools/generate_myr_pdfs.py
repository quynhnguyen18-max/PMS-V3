from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets" / "myr-results"
FONT_DIR = Path(r"C:\Windows\Fonts")

EMPLOYEES = {
    "e1": ("Nguyễn Văn Tú", "tu.nguyen", "ITC - Backend", "Lê Thị Thanh (thanh.le)"),
    "e2": ("Trần Thị Mai", "mai.tran", "ITC - Frontend", "Lê Thị Thanh (thanh.le)"),
    "e3": ("Phạm Minh Đức", "duc.pham", "ITC - Backend", "Lê Thị Thanh (thanh.le)"),
    "e4": ("Vũ Thị Lan", "lan.vu", "ITC - QA", "Lê Thị Thanh (thanh.le)"),
    "e5": ("Lê Văn Hùng", "hung.le", "ITC - Backend - Backend Core", "Nguyễn Văn Tú (tu.nguyen)"),
    "e6": ("Hoàng Thị Thu", "thu.hoang", "ITC - Frontend - Frontend Web", "Trần Thị Mai (mai.tran)"),
    "e7": ("Đặng Quang Vinh", "vinh.dang", "ITC - DevOps - Infrastructure", "Mai Thị Hằng (hang.mai)"),
    "e8": ("Nguyễn Thị Hoa", "hoa.nguyen", "PM - Product", "Trần Quang Huy (huy.tran)"),
    "e9": ("Bùi Quốc Anh", "anh.bui", "ITC - Security", "Lê Văn Dũng (dung.le)"),
    "e10": ("Đinh Thị Linh", "linh.dinh", "ITC - AI/ML", "Vũ Hoàng Nam (nam.vu)"),
    "e11": ("Cao Văn Minh", "minh.cao", "ITC - Infra", "Hoàng Văn Đức (duc.hoang)"),
    "e12": ("Phan Thị Bích", "bich.phan", "ITC - Mobile", "Đinh Văn Tùng (tung.dinh)"),
    "e13": ("Lê Hoài Nam", "nam.le", "ITC - Backend", "Lê Thị Thanh (thanh.le)"),
    "e14": ("Nguyễn Thị Phương", "phuong.nguyen", "ITC - Data", "Lê Thị Thanh (thanh.le)"),
    "e15": ("Trần Văn Khoa", "khoa.tran", "ITC - Mobile", "Lê Thị Thanh (thanh.le)"),
    "e16": ("Mai Thị Hằng", "hang.mai", "ITC - DevOps", "Lê Thị Thanh (thanh.le)"),
}

SCORES = {
    "e1": (4, None),
    "e2": (3.5, 4),
    "e3": (None, None),
    "e4": (None, None),
    "e5": (4, 4.5),
    "e6": (None, None),
    "e7": (None, None),
    "e8": (None, None),
    "e9": (None, None),
    "e10": (None, None),
    "e11": (None, None),
    "e12": (4, 4.5),
    "e13": (None, None),
    "e14": (None, None),
    "e15": (4.5, 4),
    "e16": (None, None),
}

CORE_VALUES = [
    (
        "Tập trung vào khách hàng",
        "Thấu hiểu khách hàng: Chúng tôi chủ động lắng nghe khách hàng và thấu hiểu các nhu cầu của họ.<br/>"
        "Nghĩ về khách hàng trước tiên: Chúng tôi cân nhắc góc nhìn của khách hàng trước tất cả góc nhìn khác trong quá trình ra quyết định.<br/>"
        "Cung cấp trải nghiệm khách hàng vượt trội: Chúng tôi nỗ lực hết mình để tạo ra trải nghiệm vượt xa kỳ vọng hợp lý của khách hàng.",
        "4",
        "—",
    ),
    (
        "Đổi mới sáng tạo",
        "Chúng tôi được khuyến khích xây dựng tư duy khác biệt.<br/>"
        "Chúng tôi luôn hướng đến những sự thay đổi tích cực.<br/>"
        "Chúng tôi luôn trân trọng tất cả những ý tưởng, vì những thành công lớn đều khởi nguồn từ những ý tưởng nhỏ.",
        "4",
        "—",
    ),
    (
        "Tinh thần đồng đội",
        "Chúng tôi làm việc hướng về một mục tiêu chung.<br/>"
        "Chúng tôi tôn trọng đồng nghiệp và đánh giá cao tất cả những đóng góp từ họ.<br/>"
        "Chúng tôi nỗ lực thấu hiểu để hỗ trợ nhau tốt nhất.",
        "5",
        "—",
    ),
    (
        "Thực thi xuất sắc",
        "Chúng tôi được trao quyền và luôn nỗ lực hết mình để vươn xa hơn, khám phá ra những tiềm năng của bản thân.<br/>"
        "Chúng tôi làm việc hiệu quả.<br/>"
        "Chúng tôi làm việc hết mình với thái độ trách nhiệm và tinh thần lãnh đạo tích cực.",
        "4",
        "—",
    ),
    (
        "Tinh thần học hỏi không ngừng",
        "Chúng tôi luôn chủ động nắm bắt cơ hội phát triển.<br/>"
        "Chúng tôi dám đối diện với thất bại và lựa chọn thái độ học hỏi từ những sai lầm.<br/>"
        "Chúng tôi mở rộng tầm nhìn để đón nhận những ý tưởng khác biệt.",
        "5",
        "—",
    ),
]

WORK_GOALS = [
    (
        "Tối ưu API thanh toán real-time",
        "P99 latency dưới 100ms, uptime 99.99%, không phát sinh lỗi P0 sau khi triển khai.",
        "Cao",
        "01/01/2026",
        "30/06/2026",
        "4",
        "—",
    ),
    (
        "Triển khai monitoring và alerting cho hệ thống",
        "100% critical services có dashboard và cảnh báo; giảm thời gian phát hiện sự cố xuống dưới 5 phút.",
        "Trung bình",
        "01/02/2026",
        "30/09/2026",
        "3",
        "—",
    ),
]

DEVELOPMENT_GOALS = [
    (
        "Cải thiện kỹ năng system design",
        "Hoàn thành 6 bài thực hành và 2 buổi mock interview nội bộ trước 31/10/2026.",
        "01/01/2026",
        "31/10/2026",
        "4",
        "—",
    ),
    (
        "Hoàn thành khóa AWS Solutions Architect",
        "Đạt chứng chỉ AWS Solutions Architect Associate và áp dụng vào tối thiểu 1 dự án thực tế.",
        "01/01/2026",
        "31/12/2026",
        "3",
        "—",
    ),
]


pdfmetrics.registerFont(TTFont("Arial", str(FONT_DIR / "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", str(FONT_DIR / "arialbd.ttf")))

styles = getSampleStyleSheet()
body = ParagraphStyle(
    "BodyVN",
    parent=styles["BodyText"],
    fontName="Arial",
    fontSize=8.5,
    leading=12,
    textColor=colors.HexColor("#3f3f46"),
)
small = ParagraphStyle(
    "SmallVN",
    parent=body,
    fontSize=7.5,
    leading=10,
)
title = ParagraphStyle(
    "TitleVN",
    parent=body,
    fontName="Arial-Bold",
    fontSize=15,
    leading=19,
    alignment=TA_CENTER,
    textColor=colors.HexColor("#18181b"),
    spaceAfter=5,
)
subtitle = ParagraphStyle(
    "SubtitleVN",
    parent=body,
    fontSize=9,
    alignment=TA_CENTER,
    textColor=colors.HexColor("#71717a"),
    spaceAfter=12,
)
section = ParagraphStyle(
    "SectionVN",
    parent=body,
    fontName="Arial-Bold",
    fontSize=10,
    leading=13,
    textColor=colors.HexColor("#b0005b"),
    spaceBefore=7,
    spaceAfter=6,
)
subsection = ParagraphStyle(
    "SubsectionVN",
    parent=body,
    fontName="Arial-Bold",
    fontSize=9,
    leading=12,
    textColor=colors.HexColor("#27272a"),
    spaceBefore=6,
    spaceAfter=5,
)


def p(value, style=body):
    return Paragraph(str(value), style)


def score(value):
    return "—" if value is None else str(value)


def styled_table(data, widths, header_rows=1):
    table = Table(data, colWidths=widths, repeatRows=header_rows, hAlign="LEFT")
    commands = [
        ("FONTNAME", (0, 0), (-1, -1), "Arial"),
        ("FONTSIZE", (0, 0), (-1, -1), 7.5),
        ("LEADING", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d4d4d8")),
        ("BACKGROUND", (0, 0), (-1, header_rows - 1), colors.HexColor("#f4e8ef")),
        ("TEXTCOLOR", (0, 0), (-1, header_rows - 1), colors.HexColor("#52525b")),
        ("FONTNAME", (0, 0), (-1, header_rows - 1), "Arial-Bold"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    table.setStyle(TableStyle(commands))
    return table


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Arial", 7.5)
    canvas.setFillColor(colors.HexColor("#71717a"))
    canvas.drawString(18 * mm, 12 * mm, "MoMo HRM | Kết quả đánh giá giữa năm 2026")
    canvas.drawRightString(192 * mm, 12 * mm, f"Trang {doc.page}")
    canvas.restoreState()


def build_pdf(emp_id, employee):
    name, login, team, manager = employee
    nv_score, manager_score = SCORES[emp_id]
    output = OUTPUT_DIR / f"{emp_id}.pdf"
    doc = SimpleDocTemplate(
        str(output),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=20 * mm,
        title=f"Kết quả MYR 2026 - {name}",
        author="MoMo HRM",
    )
    story = [
        p("KẾT QUẢ ĐÁNH GIÁ GIỮA NĂM 2026", title),
        p("MID-YEAR REVIEW RESULT", subtitle),
        p("I. THÔNG TIN NHÂN VIÊN", section),
    ]

    info_data = [
        [p("Nhân viên", small), p(f"<b>{name}</b> ({login})", small), p("Chu kỳ", small), p("2026", small)],
        [p("Đơn vị / Team", small), p(team, small), p("Quản lý trực tiếp", small), p(manager, small)],
    ]
    story.append(styled_table(info_data, [31 * mm, 61 * mm, 32 * mm, 52 * mm], header_rows=0))
    story.extend([Spacer(1, 4 * mm), p("II. KẾT QUẢ ĐÁNH GIÁ TOÀN DIỆN", section)])

    overall_data = [
        [p("Điểm Nhân viên tự đánh giá", small), p("Điểm Quản lý đánh giá", small), p("Điểm cuối cùng", small)],
        [p(f"<b>{score(nv_score)}</b>", body), p(f"<b>{score(manager_score)}</b>", body), p(f"<b>{score(manager_score)}</b>", body)],
    ]
    story.append(styled_table(overall_data, [58.7 * mm] * 3))
    story.extend(
        [
            Spacer(1, 4 * mm),
            p("III. KẾT QUẢ ĐÁNH GIÁ CHI TIẾT", section),
            p("1. Mục tiêu công việc", subsection),
        ]
    )

    work_data = [
        [p("Mục tiêu", small), p("Kết quả cần đạt", small), p("Ưu tiên", small), p("Từ ngày", small), p("Đến ngày", small), p("Điểm NV", small), p("Điểm QL", small)]
    ]
    for goal in WORK_GOALS:
        work_data.append([p(goal[0], small), p(goal[1], small), *[p(v, small) for v in goal[2:]]])
    story.append(styled_table(work_data, [36 * mm, 59 * mm, 17 * mm, 20 * mm, 20 * mm, 12 * mm, 12 * mm]))
    story.extend(
        [
            Spacer(1, 3 * mm),
            p("<b>Nhận xét của Nhân viên:</b> Các mục tiêu trọng tâm được triển khai đúng tiến độ; hệ thống thanh toán real-time đạt P99 85ms, vượt chỉ tiêu.", body),
            p("<b>Nhận xét của Quản lý:</b> —", body),
            Spacer(1, 3 * mm),
            p("2. Mục tiêu phát triển", subsection),
        ]
    )

    dev_data = [
        [p("Mục tiêu", small), p("Kết quả cần đạt", small), p("Từ ngày", small), p("Đến ngày", small), p("Điểm NV", small), p("Điểm QL", small)]
    ]
    for goal in DEVELOPMENT_GOALS:
        dev_data.append([p(goal[0], small), p(goal[1], small), *[p(v, small) for v in goal[2:]]])
    story.append(styled_table(dev_data, [43 * mm, 71 * mm, 22 * mm, 22 * mm, 14 * mm, 14 * mm]))
    story.extend(
        [
            Spacer(1, 3 * mm),
            p("<b>Nhận xét của Nhân viên:</b> Các mục tiêu phát triển đang đi đúng lộ trình; dự kiến hoàn thành trong nửa cuối năm.", body),
            p("<b>Nhận xét của Quản lý:</b> —", body),
            PageBreak(),
            p("3. Mục tiêu hành vi", subsection),
        ]
    )

    behavior_data = [
        [p("Giá trị cốt lõi", small), p("Mô tả", small), p("Điểm NV", small), p("Điểm QL", small)]
    ]
    for value_name, description, employee_value, manager_value in CORE_VALUES:
        behavior_data.append(
            [p(value_name, small), p(description, small), p(employee_value, small), p(manager_value, small)]
        )
    story.append(styled_table(behavior_data, [42 * mm, 110 * mm, 17 * mm, 17 * mm]))
    story.extend(
        [
            Spacer(1, 4 * mm),
            p("<b>Nhận xét của Nhân viên:</b> Tôi chủ động thể hiện các giá trị cốt lõi trong công việc hàng ngày, đặc biệt chú trọng tinh thần đồng đội và học hỏi không ngừng.", body),
            p("<b>Nhận xét của Quản lý:</b> —", body),
            Spacer(1, 5 * mm),
            p("ĐÁNH GIÁ TOÀN DIỆN", section),
            p("<b>Nhận xét của Nhân viên:</b> Nhìn chung, tôi hoàn thành trên mức kỳ vọng trong kỳ MYR 2026 và cam kết tiếp tục nâng cao năng lực trong nửa cuối năm.", body),
            p("<b>Nhận xét của Quản lý:</b> —", body),
        ]
    )
    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for emp_id, employee in EMPLOYEES.items():
        build_pdf(emp_id, employee)
    print(f"Generated {len(EMPLOYEES)} PDFs in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
