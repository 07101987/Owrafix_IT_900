/**
 * OWRAFIX Registration API — Google Apps Script upgrade
 *
 * Spreadsheet: 16ofOxZJVd0Mr3JVBM2PAeeGhJ67IK6tzC21rl6gYhRQ
 *
 * Supports:
 *   GET  ?action=list   -> returns all registered users
 *   GET  ?action=ping   -> connection test
 *   POST {action:"add", ...} -> adds a student/user to the register
 *
 * IMPORTANT:
 * Deploy as Web app:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * The GitHub Pages portal sends POST requests as text/plain to avoid a
 * browser preflight request.
 */

const OWRAFIX_SPREADSHEET_ID = '16ofOxZJVd0Mr3JVBM2PAeeGhJ67IK6tzC21rl6gYhRQ';
const DEFAULT_COURSE = 'Digital Skills & Computer Mastery for Students — 8 Weeks';

function jsonOutput(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = String(e?.parameter?.action || 'ping').toLowerCase();

  if (action === 'list') {
    return jsonOutput({
      success: true,
      students: getRegisteredStudents_(),
      count: getRegisteredStudents_().length
    });
  }

  return jsonOutput({
    success: true,
    message: 'Owrafix Student Portal API is connected.',
    status: 'online'
  });
}

function doPost(e) {
  try {
    const raw = e?.postData?.contents || '{}';
    const payload = JSON.parse(raw);
    const action = String(payload.action || '').toLowerCase();

    if (action === 'add') {
      return jsonOutput(addStudent_(payload));
    }

    return jsonOutput({ success: false, message: 'Unknown POST action.' });
  } catch (error) {
    return jsonOutput({ success: false, message: String(error.message || error) });
  }
}

function getOwrafixSpreadsheet_() {
  return SpreadsheetApp.openById(OWRAFIX_SPREADSHEET_ID);
}

function getRegistrationSheet_() {
  const ss = getOwrafixSpreadsheet_();
  const preferred = [
    'Form_Responses',
    'Form Responses',
    'Form Responses 1',
    'Registration Responses',
    'Registrations',
    'Responses'
  ];

  for (const name of preferred) {
    const sheet = ss.getSheetByName(name);
    if (sheet) return sheet;
  }

  for (const sheet of ss.getSheets()) {
    if (sheet.getLastRow() < 1) continue;
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
    const normalized = headers.map(normalizeHeader_);
    if (normalized.some(h => h.includes('fullname') || h.includes('name'))) {
      return sheet;
    }
  }

  throw new Error('No registration sheet could be found.');
}

function getRegisteredStudents_() {
  const sheet = getRegistrationSheet_();
  const lastRow = sheet.getLastRow();
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  if (lastRow < 2) return [];

  const values = sheet.getRange(1, 1, lastRow, lastColumn).getDisplayValues();
  const headers = values[0];
  const records = [];

  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    if (row.every(cell => String(cell).trim() === '')) continue;

    const record = rowToStudent_(headers, row, r + 1);
    if (record && record.name) records.push(record);
  }

  return records;
}

function addStudent_(payload) {
  const sheet = getRegistrationSheet_();
  ensureHeader_(sheet, 'Registration Number');
  ensureHeader_(sheet, 'Role');
  ensureHeader_(sheet, 'Course');
  ensureHeader_(sheet, 'Profession');
  ensureHeader_(sheet, 'Payment Status');
  ensureHeader_(sheet, 'Enrolment Status');
  ensureHeader_(sheet, 'Total Due');
  ensureHeader_(sheet, 'Total Paid');
  ensureHeader_(sheet, 'Balance');

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const normalized = headers.map(normalizeHeader_);
  const nextRow = sheet.getLastRow() + 1;
  const regNo = String(payload.regNo || '').trim() || generateRegistrationNumber_(sheet);

  const totalDue = Number(payload.totalDue || 0);
  const totalPaid = Number(payload.totalPaid || 0);
  const balance = Math.max(totalDue - totalPaid, 0);

  const data = {
    registrationnumber: regNo,
    timestamp: new Date(),
    fullname: payload.name || '',
    name: payload.name || '',
    gender: payload.gender || '',
    phonenumber: payload.phone || '',
    whatsappnumber: payload.whatsapp || payload.phone || '',
    emailaddress: payload.email || '',
    email: payload.email || '',
    towncity: payload.town || '',
    highesteducationallevel: payload.education || '',
    profession: payload.profession || '',
    course: payload.course || DEFAULT_COURSE,
    role: payload.role || 'student',
    paymentstatus: payload.paymentStatus || 'PENDING',
    enrolmentstatus: payload.enrolmentStatus || 'REGISTERED',
    totaldue: totalDue,
    totalpaid: totalPaid,
    balance: balance
  };

  const output = headers.map((header, index) => {
    const key = normalized[index];
    return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : '';
  });

  sheet.getRange(nextRow, 1, 1, output.length).setValues([output]);

  return {
    success: true,
    message: `${data.fullname} was added successfully. Registration No.: ${regNo}`,
    student: rowToStudent_(headers, output, nextRow)
  };
}

function rowToStudent_(headers, row, sheetRowNumber) {
  const map = {};
  headers.forEach((header, index) => {
    map[normalizeHeader_(header)] = row[index] ?? '';
  });

  const name = first_(map, ['fullname', 'name', 'applicantname']);
  if (!String(name).trim()) return null;

  const storedRegNo = first_(map, ['registrationnumber', 'registrationno', 'regno']);
  const regNo = storedRegNo || `OWR-${new Date().getFullYear()}-${String(sheetRowNumber - 1).padStart(4, '0')}`;
  const phone = first_(map, ['phonenumber', 'phone', 'whatsappnumber', 'whatsapp']);
  const totalDue = number_(first_(map, ['totaldue', 'amountdue', 'coursefee']));
  const totalPaid = number_(first_(map, ['totalpaid', 'amountpaid']));
  const explicitBalance = first_(map, ['balance']);
  const balance = explicitBalance === '' ? Math.max(totalDue - totalPaid, 0) : number_(explicitBalance);

  let paymentStatus = String(first_(map, ['paymentstatus', 'payment_status']) || 'PENDING').toUpperCase();
  if (!['FULLY PAID', 'PARTIALLY PAID', 'PENDING', 'UNPAID'].includes(paymentStatus)) paymentStatus = 'PENDING';

  let enrolmentStatus = String(first_(map, ['enrolmentstatus', 'enrollmentstatus']) || 'REGISTERED').toUpperCase();
  if (!['REGISTERED', 'ACTIVE', 'COMPLETED'].includes(enrolmentStatus)) enrolmentStatus = 'REGISTERED';

  const roleValue = String(first_(map, ['role']) || 'student').toLowerCase();
  const role = ['admin', 'teacher'].includes(roleValue) ? roleValue : 'student';

  return {
    regNo: regNo,
    name: String(name),
    phone: String(phone),
    whatsapp: String(first_(map, ['whatsappnumber', 'whatsapp']) || phone),
    email: String(first_(map, ['emailaddress', 'email'])),
    town: String(first_(map, ['towncity', 'town', 'city'])),
    education: String(first_(map, ['highesteducationallevel', 'education', 'educationallevel'])),
    profession: String(first_(map, ['profession', 'occupation'])),
    role: role,
    course: String(first_(map, ['course', 'programme', 'program']) || DEFAULT_COURSE),
    totalDue: totalDue,
    totalPaid: totalPaid,
    balance: balance,
    paymentStatus: paymentStatus,
    enrolmentStatus: enrolmentStatus,
    paymentReference: String(first_(map, ['paymentreference', 'reference'])),
    displayPhone: formatGhanaPhone_(String(phone))
  };
}

function ensureHeader_(sheet, desiredHeader) {
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
  const target = normalizeHeader_(desiredHeader);
  if (headers.some(header => normalizeHeader_(header) === target)) return;
  sheet.getRange(1, lastColumn + 1).setValue(desiredHeader);
}

function generateRegistrationNumber_(sheet) {
  const year = new Date().getFullYear();
  const count = Math.max(sheet.getLastRow() - 1, 0) + 1;
  return `OWR-${year}-${String(count).padStart(4, '0')}`;
}

function normalizeHeader_(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function first_(map, keys) {
  for (const key of keys) {
    const value = map[key];
    if (value !== undefined && String(value).trim() !== '') return value;
  }
  return '';
}

function number_(value) {
  const parsed = Number(String(value || '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatGhanaPhone_(phone) {
  const digits = String(phone || '').replace(/[^0-9]/g, '');
  if (digits.length === 10 && digits.startsWith('0')) return digits;
  if (digits.length === 12 && digits.startsWith('233')) return `0${digits.substring(3)}`;
  return phone;
}
