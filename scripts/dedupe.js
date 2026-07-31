const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const dataDir = path.join(__dirname, '../data');
const outputFilePath = path.join(dataDir, 'polished_leads.csv');

const leadsMap = new Map();

const files = fs.readdirSync(dataDir).filter(file => file.startsWith('google') && file.endsWith('.csv'));

let processedFiles = 0;

function cleanString(str) {
  if (!str) return '';
  return str.replace(/['"]+/g, '').trim();
}

function processFile(filePath) {
  return new Promise((resolve) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Attempt to extract values based on Instant Data Scraper headers
        // These can be inconsistent, so we try multiple possible headers if they exist
        const mapsLink = row['hfpxzc href'] || row['mapsLink'] || '';
        const name = row['xxVWCe'] || row['businessName'] || '';
        
        // Skip empty rows
        if (!name && !mapsLink) return;

        const ratingRaw = row['MW4etd'] || row['rating'] || '';
        const reviewCountRaw = row['UY7F9'] || row['reviewCount'] || '';
        const category = row['W4Efsd'] || row['category'] || '';
        
        // Address might be in different 'W4Efsd X' columns depending on missing data. We take 'W4Efsd 4' as a guess,
        // but we should just join available W4Efsd columns that look like addresses if we wanted perfection.
        const address = row['W4Efsd 4'] || row['address'] || '';
        const hours = row['W4Efsd 5'] || row['openingHours'] || '';
        
        const phone = row['UsdlK'] || row['phone'] || '';
        const website = row['lcr4fd href'] || row['website'] || '';

        // Clean review count e.g. "(102)" -> "102"
        const reviewCount = reviewCountRaw.replace(/[^\d]/g, '');

        const lead = {
          businessName: cleanString(name),
          phone: cleanString(phone),
          website: cleanString(website),
          mapsLink: cleanString(mapsLink),
          rating: cleanString(ratingRaw),
          reviewCount: reviewCount,
          category: cleanString(category),
          address: cleanString(address),
          businessAge: '',
          openingHours: cleanString(hours),
          latestReview: '',
          status: 'Not Called',
          priority: 'None',
          followUpDate: ''
        };

        // Deduplication strategy: Use Phone if available, otherwise Maps Link, otherwise Name
        let key = lead.phone.replace(/[^\d]/g, '');
        if (!key || key.length < 5) key = lead.mapsLink;
        if (!key) key = lead.businessName.toLowerCase();

        if (key && !leadsMap.has(key)) {
          leadsMap.set(key, lead);
        }
      })
      .on('end', () => {
        processedFiles++;
        if (processedFiles === files.length) {
          writeCsv();
        }
        resolve();
      });
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
      console.log(`Deduplication complete. Original files: ${files.length}. Unique leads saved: ${records.length}.`);
      console.log(`Saved to ${outputFilePath}`);
    });
}

async function run() {
  if (files.length === 0) {
    console.log('No google*.csv files found in data directory.');
    return;
  }
  for (const file of files) {
    await processFile(path.join(dataDir, file));
  }
}

run();
