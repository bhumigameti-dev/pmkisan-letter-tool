function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // --- Robust font loader: try common variable names produced by converters ---
  const fontCandidates = [
    (typeof gujarati_font !== 'undefined' && gujarati_font),
    (typeof gujaratiFont !== 'undefined' && gujaratiFont),
    (typeof NotoSansGujarati !== 'undefined' && NotoSansGujarati),
    (typeof NotoSansGujaratiRegular !== 'undefined' && NotoSansGujaratiRegular),
    (typeof NotoSansGujarati_Regular !== 'undefined' && NotoSansGujarati_Regular),
    (typeof NotoSansGujarati_Regular_ttf !== 'undefined' && NotoSansGujarati_Regular_ttf),
    (typeof font !== 'undefined' && font),
  ];
  const fontData = fontCandidates.find(f => !!f) || null;

  if (!fontData) {
    alert('ફોન્ટ ડેટા મળ્યું નહીં. કૃપા કરીને font.js માંથી ફૉન્ટનું 변수를 તપાસો (ઉદાહરણ: NotoSansGujarati) અને મને જણાવો.');
    return;
  }

  // Register font with a stable internal name
  try {
    doc.addFileToVFS("NotoSansGujarati.ttf", fontData);
    doc.addFont("NotoSansGujarati.ttf", "NotoSansGujarati", "normal");
    doc.setFont("NotoSansGujarati");
  } catch (e) {
    console.error('Font registration failed:', e);
    alert('ફોન્ટ લોડ કરવામાં ગડબડ થઈ — કન્સોલ તપાસો.');
    return;
  }

  doc.setFontSize(12);

  // --- Read form values ---
  const bank_name = document.getElementById("bank_name").value || "";
  const farmer_name = document.getElementById("farmer_name").value || "";
  const aadhaar = document.getElementById("aadhaar").value || "";
  const account_no = document.getElementById("account_no").value || "";
  const death_date = document.getElementById("death_date").value || "";
  const installments = document.getElementById("installments").value || "";
  const amount = document.getElementById("amount").value || "";
  const varasdar = document.getElementById("varasdar_nu_naam").value || "";
  const village = document.getElementById("village").value || "";
  const mobile = document.getElementById("mobile").value || "";

  // --- Your Gujarati letter template with placeholders replaced ---
  const text = `
જા.નં/તા.અ.અ./પી.એમ.કે/ ……….. / 2025
તા: ...................................

પ્રતિ,
બેન્ક મેનેજરશ્રી
${bank_name}

વિષય: પી.એમ.કિસાન યોજના અંતર્ગત મૃત્યુ પામેલ લાભાર્થી ખેડૂતની સહાય પરત કરવા બાબત

અનુ.: ગુજરનાર લાભાર્થી સ્વ ${farmer_name} નાં વારસદારની મૌખિક રજૂઆત

જય ભારત,
ઉપર્યુક્ત વિષય અન્વયે જણાવવાનું કે ભારત સરકારશ્રી દ્વારા પ્રધાનમંત્રી કિસાન સમ્માન નિધિ યોજના ફેબ્રુઆરી ૨૦૧૯ થી અમલમાં છે. જેમાં ખેડૂત કુટુંબને પ્રતિ વર્ષ રૂ. ૬૦૦૦/- ડી.બી.ટી માધ્યમથી દર ચાર માસે સમાન હપ્તામાં ચૂકવવામાં આવે છે.

આ યોજના હેઠળ લાભાર્થી ખેડૂત કુટુંબનું મૃત્યુ થયેલ હોય તે સ્થિતિમાં મૃત્યુ બાદ મળેલ હપ્તાની રકમ પરત જમા કરાવવાની થાય છે. રાજ્ય સરકારશ્રી દ્વારા નીચેના ખાતા ખોલવામાં આવેલ છે:

નામ: PM KISAN FUND RECOVERY ACCOUNT
બેંક નામ: સ્ટેટ બેંક ઓફ ઈન્ડિયા
બ્રાંચ: ગાંધીનગર
ખાતા નંબર: 39726757468  | IFSC: SBIN0001355

સ્વ. ${farmer_name} (આધાર: ${aadhaar}, ખાતા નં: ${account_no}) નું તા: ${death_date} ના રોજ નિધન થયેલ છે. તેમના વારસદાર દ્વારા DEATH CERTIFICATE રજૂ કરેલ છે. યોજનામાં સ્ટોપ પેમેન્ટ કરવામાં આવેલ છે.

મૃત્યુ બાદ મળેલ કુલ ${installments} હપ્તાની રકમ રૂ. ${amount}/- સરકારશ્રીને પરત કરવાની થાય છે. ઉપર જણાવેલ ખાતામાં RTGSથી જમા કરાવવા વિનંતી છે.

ખેડૂતનું નામ: ${varasdar}
ગામ: ${village}
મોબાઇલ: ${mobile}

ગ્રામસેવક
`;

  // --- Draw text with wrapping ---
  const leftMargin = 14;
  const topStart = 18;
  const pageWidth = doc.internal.pageSize.getWidth() - leftMargin * 2;
  const lines = doc.splitTextToSize(text, pageWidth);
  doc.text(lines, leftMargin, topStart);

  // --- Save the PDF ---
  doc.save("pmkisan_letter.pdf");
}
