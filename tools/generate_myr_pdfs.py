import json
import shutil
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "assets" / "employees-data.js"
OUTPUT_DIR = ROOT / "assets" / "myr-results"
FONT_DIR = Path(r"C:\Windows\Fonts")

CORE_VALUES = [
    (
        "Tập trung vào khách hàng",
        "Thấu hiểu khách hàng: Chúng tôi chủ động lắng nghe khách hàng và thấu hiểu các nhu cầu của họ.<br/>"
        "Nghĩ về khách hàng trước tiên: Chúng tôi cân nhắc góc nhìn của khách hàng trước tất cả góc nhìn khác trong quá trình ra quyết định.<br/>"
        "Cung cấp trải nghiệm khách hàng vượt trội: Chúng tôi nỗ lực hết mình để tạo ra trải nghiệm vượt xa kỳ vọng hợp lý của khách hàng.",
    ),
    (
        "Đổi mới sáng tạo",
        "Chúng tôi được khuyến khích xây dựng tư duy khác biệt.<br/>"
        "Chúng tôi luôn hướng đến những sự thay đổi tích cực.<br/>"
        "Chúng tôi luôn trân trọng tất cả những ý tưởng, vì những thành công lớn đều khởi nguồn từ những ý tưởng nhỏ.",
    ),
    (
        "Tinh thần đồng đội",
        "Chúng tôi làm việc hướng về một mục tiêu chung.<br/>"
        "Chúng tôi tôn trọng đồng nghiệp và đánh giá cao tất cả những đóng góp từ họ.<br/>"
        "Chúng tôi nỗ lực thấu hiểu để hỗ trợ nhau tốt nhất.",
    ),
    (
        "Thực thi xuất sắc",
        "Chúng tôi được trao quyền và luôn nỗ lực hết mình để vươn xa hơn, khám phá ra những tiềm năng của bản thân.<br/>"
        "Chúng tôi làm việc hiệu quả.<br/>"
        "Chúng tôi làm việc hết mình với thái độ trách nhiệm và tinh thần lãnh đạo tích cực.",
    ),
    (
        "Tinh thần học hỏi không ngừng",
        "Chúng tôi luôn chủ động nắm bắt cơ hội phát triển.<br/>"
        "Chúng tôi dám đối diện với thất bại và lựa chọn thái độ học hỏi từ những sai lầm.<br/>"
        "Chúng tôi mở rộng tầm nhìn để đón nhận những ý tưởng khác biệt.",
    ),
]


def find_node():
    installed = shutil.which("node")
    if installed:
        return installed
    bundled = (
        Path.home()
        / ".cache"
        / "codex-runtimes"
        / "codex-primary-runtime"
        / "dependencies"
        / "node"
        / "bin"
        / "node.exe"
    )
    if bundled.exists():
        return str(bundled)
    raise RuntimeError("Node.js is required to read assets/employees-data.js")


def load_shared_data():
    script = """
const fs = require('fs');
const vm = require('vm');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(process.argv[1], 'utf8'), context);
process.stdout.write(JSON.stringify({
  employees: context.window.PMS_EMPLOYEES || [],
  reviews: context.window.PMS_MYR || {},
  selfEvaluations: context.window.PMS_SELFEVAL || {},
  lm1Evaluations: context.window.PMS_LM1EVAL || {}
}));
"""
    result = subprocess.run(
        [find_node(), "-e", script, str(DATA_FILE)],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


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
small = ParagraphStyle("SmallVN", parent=body, fontSize=7.5, leading=10)
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


def paragraph(value, style=body, markup=False):
    text = str(value if value is not None else "")
    return Paragraph(text if markup else escape(text), style)


def score(value):
    return "—" if value is None or value == "" else str(value)


def dated(value):
    text = str(value or "")
    return f"{text}/2026" if text and text.count("/") == 1 else text


def rich_label(label, value):
    return paragraph(f"<b>{escape(label)}:</b> {escape(value or '—')}", body, markup=True)


def styled_table(data, widths, header_rows=1):
    table = Table(data, colWidths=widths, repeatRows=header_rows, hAlign="LEFT")
    commands = [
        ("FONTNAME", (0, 0), (-1, -1), "Arial"),
        ("FONTSIZE", (0, 0), (-1, -1), 7.5),
        ("LEADING", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d4d4d8")),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    if header_rows:
        commands.extend(
            [
                ("BACKGROUND", (0, 0), (-1, header_rows - 1), colors.HexColor("#f4e8ef")),
                ("TEXTCOLOR", (0, 0), (-1, header_rows - 1), colors.HexColor("#52525b")),
                ("FONTNAME", (0, 0), (-1, header_rows - 1), "Arial-Bold"),
            ]
        )
    table.setStyle(TableStyle(commands))
    return table


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Arial", 7.5)
    canvas.setFillColor(colors.HexColor("#71717a"))
    canvas.drawString(18 * mm, 12 * mm, "MoMo HRM | Kết quả đánh giá giữa năm 2026")
    canvas.drawRightString(192 * mm, 12 * mm, f"Trang {doc.page}")
    canvas.restoreState()


def employee_team(employee):
    return " - ".join(
        value for value in (employee.get("div"), employee.get("dept"), employee.get("team")) if value
    )


def employee_manager(employee):
    manager = employee.get("mgr")
    if manager:
        return f"{manager.get('name', '')} ({manager.get('login', '')})"
    return "Lê Thị Thanh (thanh.le)"


def approved_goals(employee, goal_type):
    return [
        goal
        for goal in employee.get("goals", [])
        if goal.get("type") == goal_type and goal.get("status") == "approved"
    ]


def highest_manager_score(review):
    for role in ("hod", "lm2", "lm1"):
        value = review.get(role)
        if value is not None:
            return value
    return None


def goal_table(goals, self_evaluation, lm1_evaluation, with_priority):
    headers = ["Mục tiêu", "Kết quả cần đạt"]
    if with_priority:
        headers.append("Ưu tiên")
    headers.extend(["Từ ngày", "Đến ngày", "Điểm NV", "Điểm LM1"])
    data = [[paragraph(value, small) for value in headers]]
    self_scores = self_evaluation.get("goalScores", {})
    lm1_scores = lm1_evaluation.get("goalScores", {})
    priorities = {"h": "Cao", "m": "Trung bình", "l": "Thấp"}
    for goal in goals:
        row = [paragraph(goal.get("title", ""), small), paragraph(goal.get("result", ""), small)]
        if with_priority:
            row.append(paragraph(priorities.get(goal.get("prio"), "—"), small))
        row.extend(
            [
                paragraph(dated(goal.get("s")), small),
                paragraph(dated(goal.get("e")), small),
                paragraph(score(self_scores.get(goal.get("id"))), small),
                paragraph(score(lm1_scores.get(goal.get("id"))), small),
            ]
        )
        data.append(row)
    widths = (
        [36 * mm, 59 * mm, 17 * mm, 20 * mm, 20 * mm, 12 * mm, 12 * mm]
        if with_priority
        else [43 * mm, 71 * mm, 22 * mm, 22 * mm, 14 * mm, 14 * mm]
    )
    return styled_table(data, widths)


def add_goal_section(story, number, label, goals, self_eval, lm1_eval, comment_key, with_priority):
    story.append(paragraph(f"{number}. {label}", subsection))
    story.append(goal_table(goals, self_eval, lm1_eval, with_priority))
    story.extend(
        [
            Spacer(1, 3 * mm),
            rich_label("Nhận xét của Nhân viên", self_eval.get("comments", {}).get(comment_key)),
            rich_label("Nhận xét của Quản lý trực tiếp", lm1_eval.get("comments", {}).get(comment_key)),
            Spacer(1, 3 * mm),
        ]
    )


def build_pdf(employee, reviews, self_evaluations, lm1_evaluations):
    emp_id = employee["id"]
    review = reviews.get(emp_id, {})
    submitted = review.get("submitted") is True
    self_eval = self_evaluations.get(emp_id, {}) if submitted else {}
    lm1_eval = lm1_evaluations.get(emp_id, {}) if review.get("lm1") is not None else {}
    work_goals = approved_goals(employee, "what")
    development_goals = approved_goals(employee, "dev")
    final_score = review.get("final")
    if final_score is None:
        final_score = highest_manager_score(review)

    output = OUTPUT_DIR / f"{emp_id}.pdf"
    doc = SimpleDocTemplate(
        str(output),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=20 * mm,
        title=f"Kết quả MYR 2026 - {employee['name']}",
        author="MoMo HRM",
    )
    story = [
        paragraph("KẾT QUẢ ĐÁNH GIÁ GIỮA NĂM 2026", title),
        paragraph("MID-YEAR REVIEW RESULT", subtitle),
        paragraph("I. THÔNG TIN NHÂN VIÊN", section),
    ]
    info_data = [
        [
            paragraph("Nhân viên", small),
            paragraph(f"{employee['name']} ({employee['login']})", small),
            paragraph("Chu kỳ", small),
            paragraph("2026", small),
        ],
        [
            paragraph("Đơn vị / Team", small),
            paragraph(employee_team(employee), small),
            paragraph("Quản lý trực tiếp", small),
            paragraph(employee_manager(employee), small),
        ],
    ]
    story.append(styled_table(info_data, [31 * mm, 61 * mm, 32 * mm, 52 * mm], header_rows=0))
    story.extend([Spacer(1, 4 * mm), paragraph("II. KẾT QUẢ ĐÁNH GIÁ TOÀN DIỆN", section)])

    overall_data = [
        [
            paragraph("Điểm Nhân viên", small),
            paragraph("Điểm LM1", small),
            paragraph("Điểm LM2", small),
            paragraph("Điểm HOD", small),
            paragraph("Điểm cuối cùng", small),
        ],
        [
            paragraph(score(review.get("nv")), body),
            paragraph(score(review.get("lm1")), body),
            paragraph(score(review.get("lm2")), body),
            paragraph(score(review.get("hod")), body),
            paragraph(score(final_score), body),
        ],
    ]
    story.append(styled_table(overall_data, [35.2 * mm] * 5))
    story.extend(
        [
            Spacer(1, 4 * mm),
            paragraph("III. KẾT QUẢ ĐÁNH GIÁ CHI TIẾT", section),
        ]
    )

    section_number = 1
    add_goal_section(
        story,
        section_number,
        "Mục tiêu công việc",
        work_goals,
        self_eval,
        lm1_eval,
        "what",
        True,
    )
    section_number += 1
    if development_goals:
        add_goal_section(
            story,
            section_number,
            "Mục tiêu phát triển",
            development_goals,
            self_eval,
            lm1_eval,
            "dev",
            False,
        )
        section_number += 1

    story.extend([PageBreak(), paragraph(f"{section_number}. Mục tiêu hành vi", subsection)])
    behavior_data = [
        [
            paragraph("Giá trị cốt lõi", small),
            paragraph("Mô tả", small),
            paragraph("Điểm NV", small),
            paragraph("Điểm LM1", small),
        ]
    ]
    self_how = self_eval.get("howScores", [])
    lm1_how = lm1_eval.get("howScores", [])
    for index, (value_name, description) in enumerate(CORE_VALUES):
        behavior_data.append(
            [
                paragraph(value_name, small),
                paragraph(description, small, markup=True),
                paragraph(score(self_how[index] if index < len(self_how) else None), small),
                paragraph(score(lm1_how[index] if index < len(lm1_how) else None), small),
            ]
        )
    story.append(styled_table(behavior_data, [42 * mm, 110 * mm, 17 * mm, 17 * mm]))
    story.extend(
        [
            Spacer(1, 4 * mm),
            rich_label("Nhận xét của Nhân viên", self_eval.get("comments", {}).get("how")),
            rich_label("Nhận xét của Quản lý trực tiếp", lm1_eval.get("comments", {}).get("how")),
            Spacer(1, 5 * mm),
            paragraph("ĐÁNH GIÁ TOÀN DIỆN", section),
            rich_label("Nhận xét của Nhân viên", self_eval.get("overall", {}).get("comment")),
            rich_label("Nhận xét của Quản lý trực tiếp", lm1_eval.get("overall", {}).get("comment")),
        ]
    )
    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)


def main():
    shared = load_shared_data()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for employee in shared["employees"]:
        build_pdf(
            employee,
            shared["reviews"],
            shared["selfEvaluations"],
            shared["lm1Evaluations"],
        )
    print(f"Generated {len(shared['employees'])} PDFs in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
