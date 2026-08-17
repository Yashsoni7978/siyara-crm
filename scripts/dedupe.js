const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const { createObjectCsvWriter } = require('csv-writer');

const dataDir = path.join(__dirname, '../data');
const outputFilePath = path.join(dataDir, 'polished_leads.csv');

const leadsMap = new Map();

function getAllDataFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllDataFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.csv') || entry.name.endsWith('.xlsx')) && entry.name !== 'polished_leads.csv') {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllDataFiles(dataDir);

function cleanString(str) {
  if (!str) return '';
  return String(str).replace(/['"]+/g, '').trim();
}

function processRow(row, filePath) {
  const isDoctorDir = filePath.toLowerCase().includes('doctor');
  const isAnchorDir = filePath.toLowerCase().includes('anchor');

  const mapsLink = row['hfpxzc href'] || row['mapsLink'] || row['URL'] || '';
  const name = row['xxVWCe'] || row['businessName'] || row['Title'] || row['Name'] || '';
  
  if (!name && !mapsLink) return;

  const ratingRaw = row['MW4etd'] || row['rating'] || row['Rating'] || '';
  const reviewCountRaw = row['UY7F9'] || row['reviewCount'] || row['Reviews'] || '';
  let extractedCat = row['W4Efsd'] || row['category'] || row['Category'] || '';
  const address = row['W4Efsd 4'] || row['W4Efsd 3'] || row['W4Efsd 5'] || row['address'] || row['Address'] || '';
  const hours = row['W4Efsd 5'] || row['openingHours'] || '';
  const phone = row['UsdlK'] || row['phone'] || row['Phone'] || '';
  const website = row['lcr4fd href'] || row['website'] || row['Website'] || '';

  const cleanedName = cleanString(name);
  const cleanedAddress = cleanString(address);
  let category = cleanString(extractedCat);

  const allAddressStr = [
    row['W4Efsd 2'],
    row['W4Efsd 3'],
    row['W4Efsd 4'],
    row['W4Efsd 5'],
    row['W4Efsd 6'],
    row['W4Efsd 7'],
    row['address'],
    row['Address'],
    cleanedAddress
  ].filter(Boolean).join(' ');

  if (isAnchorDir) {
    const nameLower = cleanedName.toLowerCase();
    const catLower = category.toLowerCase();

    // Skip doctor/hospital entries inside anchor files
    if (catLower.includes('doctor') || catLower.includes('clinic') || catLower.includes('hospital') || nameLower.startsWith('dr. ') || nameLower.startsWith('dr ')) {
      return;
    }

    const hasJaipur = (allAddressStr + ' ' + cleanedName + ' ' + mapsLink).toLowerCase().includes('jaipur');
    const isAnchorYash = nameLower.includes('yash');

    // Filter rules for anchor directory:
    // 1. Remove anyone with Jaipur in address/name/mapsLink
    // 2. Remove anyone named Anchor Yash / containing 'yash'
    if (hasJaipur || isAnchorYash) {
      return;
    }
    category = 'Anchor';
  } else if (isDoctorDir) {
    const catLower = category.toLowerCase();
    if (catLower.includes('dentist')) {
      category = 'Dentist';
    } else if (catLower.includes('physio')) {
      category = 'Physiotherapist';
    } else {
      category = 'Doctor';
    }
  } else {
    const catLower = category.toLowerCase();
    const nameLower = cleanedName.toLowerCase();
    if (catLower.includes('anchor') || catLower.includes('emcee') || nameLower.includes('anchor') || nameLower.includes('emcee')) {
      const hasJaipur = (allAddressStr + ' ' + cleanedName + ' ' + mapsLink).toLowerCase().includes('jaipur');
      const isAnchorYash = nameLower.includes('yash');
      if (hasJaipur || isAnchorYash) {
        return;
      }
      category = 'Anchor';
    } else if (!category || category === '·') {
      category = 'General';
    }
  }

  const reviewCount = String(reviewCountRaw).replace(/[^\d]/g, '');

  const lead = {
    businessName: cleanedName,
    phone: cleanString(phone),
    website: cleanString(website),
    mapsLink: cleanString(mapsLink),
    rating: cleanString(ratingRaw),
    reviewCount: reviewCount,
    category: category,
    address: cleanedAddress,
    businessAge: '',
    openingHours: cleanString(hours),
    latestReview: '',
    status: 'Not Called',
    priority: 'None',
    followUpDate: ''
  };

  let key = lead.phone.replace(/[^\d]/g, '');
  if (!key || key.length < 5) key = lead.mapsLink;
  if (!key) key = lead.businessName.toLowerCase();

  if (key && !leadsMap.has(key)) {
    leadsMap.set(key, lead);
  }
}

function processFile(filePath) {
  return new Promise((resolve, reject) => {
    if (filePath.endsWith('.xlsx')) {
      try {
        const workbook = XLSX.readFile(filePath);
        for (const sheetName of workbook.SheetNames) {
          const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          for (const row of rows) {
            processRow(row, filePath);
          }
        }
        resolve();
      } catch (err) {
        console.error(`Error processing XLSX file ${filePath}:`, err);
        resolve();
      }
    } else {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => processRow(row, filePath))
        .on('end', resolve)
        .on('error', (err) => {
          console.error(`Error processing CSV file ${filePath}:`, err);
          resolve();
        });
    }
  });
}

function writeCsv() {
  const csvWriter = createObjectCsvWriter({
    path: outputFilePath,
    header: [
      { id: 'businessName', title: 'Business Name' },
      { id: 'phone', title: 'Phone' },
      { id: 'website', title: 'Website' },
      { id: 'mapsLink', title: 'Maps Link' },
      { id: 'rating', title: 'Rating' },
      { id: 'reviewCount', title: 'Review Count' },
      { id: 'category', title: 'Category' },
      { id: 'address', title: 'Address' },
      { id: 'businessAge', title: 'Business Age' },
      { id: 'openingHours', title: 'Opening Hours' },
      { id: 'latestReview', title: 'Latest Review' },
      { id: 'status', title: 'Status' },
      { id: 'priority', title: 'Priority' },
      { id: 'followUpDate', title: 'Follow-up Date' }
    ]
  });

  const records = Array.from(leadsMap.values());
  csvWriter.writeRecords(records)
    .then(() => {
      console.log(`Deduplication complete. Original files scanned: ${files.length}. Unique leads saved: ${records.length}.`);
      console.log(`Saved to ${outputFilePath}`);
    });
}

async function run() {
  if (files.length === 0) {
    console.log('No data files found in data directory or subdirectories.');
    return;
  }
  for (const file of files) {
    await processFile(file);
  }
  writeCsv();
}

run();


