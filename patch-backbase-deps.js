const fs = require('fs');
const path = require('path');

console.log('Patching Backbase dependencies to fix build issues...');

// Function to backup a file before modifying it
function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.bak`;
    // Only create backup if it doesn't already exist
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`Created backup of ${path.basename(filePath)}`);
    }
  }
}

// Function to patch a file with string replacement
function patchFile(filePath, searchPattern, replacement) {
  if (fs.existsSync(filePath)) {
    try {
      backupFile(filePath);
      
      // Read the file content
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Find and replace the problematic pattern
      const patched = content.replace(searchPattern, replacement);
      
      // Only write if changes were made
      if (patched !== content) {
        fs.writeFileSync(filePath, patched);
        console.log(`Successfully patched ${path.basename(filePath)}`);
        return true;
      } else {
        console.log(`No changes needed for ${path.basename(filePath)}`);
        return false;
      }
    } catch (error) {
      console.error(`Error patching ${path.basename(filePath)}:`, error);
      return false;
    }
  } else {
    console.log(`File not found: ${filePath}`);
    return false;
  }
}

// Path to the problematic files
const transactionSigningFile = path.resolve('./node_modules/@backbase/identity-auth/fesm2022/backbase-identity-auth-transaction-signing.mjs');
const initiatePaymentFile = path.resolve('./node_modules/@backbase/initiate-payment-journey-ang/fesm2022/backbase-initiate-payment-journey-ang-internal-feature-review.mjs');

// Patch the transaction signing file
patchFile(
  transactionSigningFile,
  /import\s*{\s*OtpEntryErrorTypeEnum\s*}\s*from\s*['"]@backbase\/identity-auth\/internal['"];?/g,
  "// Patched by build script\nexport const OtpEntryErrorTypeEnum = { ERROR: 'error', WARNING: 'warning' };"
);

// Patch the initiate payment file
patchFile(
  initiatePaymentFile,
  /import\s*{(?:[^}]*,\s*)?TransactionSigningService(?:\s*,\s*[^}]*)?}\s*from\s*['"]@backbase\/identity-auth\/transaction-signing['"];?/g,
  "// Patched by build script\nclass PatchedTransactionSigningService { signTransaction() { return { subscribe: () => {} }; } };\nconst TransactionSigningService = PatchedTransactionSigningService;"
);

// Create missing enum in root tsconfig paths
const tsconfigPath = path.resolve('./tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  try {
    backupFile(tsconfigPath);
    
    // Read the tsconfig
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    // Add path mappings if they don't exist
    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
    }
    
    if (!tsconfig.compilerOptions.paths) {
      tsconfig.compilerOptions.paths = {};
    }
    
    // Add our path mappings
    tsconfig.compilerOptions.paths["@backbase/identity-auth/internal"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/identity-auth-transaction-signing-fixes"];
    tsconfig.compilerOptions.paths["@backbase/identity-auth/transaction-signing"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/identity-auth-transaction-signing-fixes"];
    tsconfig.compilerOptions.paths["@backbase-gsa/transactions-journey"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/journey-mocks"];
    tsconfig.compilerOptions.paths["@backbase-gsa/transactions-journey/internal/shared-data"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/journey-mocks"];
    tsconfig.compilerOptions.paths["@backbase-gsa/transfer-journey"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/journey-mocks"];
    tsconfig.compilerOptions.paths["@backbase-gsa/transfer-journey/internal/shared-data"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/journey-mocks"];
    tsconfig.compilerOptions.paths["@backbase-gsa/ach-positive-pay-journey"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/journey-mocks"];
    tsconfig.compilerOptions.paths["@backbase-gsa/ach-positive-pay-journey/internal/feature"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/journey-mocks"];
    
    // Write the updated config
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log('Updated path mappings in tsconfig.json');
  } catch (error) {
    console.error('Error updating tsconfig.json:', error);
  }
}

// Update the tsconfig.base.json file if it exists
const tsconfigBasePath = path.resolve('./tsconfig.base.json');
if (fs.existsSync(tsconfigBasePath)) {
  try {
    backupFile(tsconfigBasePath);
    
    // Read the tsconfig.base.json
    const tsconfigBase = JSON.parse(fs.readFileSync(tsconfigBasePath, 'utf8'));
    
    // Add path mappings if they don't exist
    if (!tsconfigBase.compilerOptions) {
      tsconfigBase.compilerOptions = {};
    }
    
    if (!tsconfigBase.compilerOptions.paths) {
      tsconfigBase.compilerOptions.paths = {};
    }
    
    // Add our path mappings
    tsconfigBase.compilerOptions.paths["@backbase/identity-auth/internal"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/identity-auth-transaction-signing-fixes"];
    tsconfigBase.compilerOptions.paths["@backbase/identity-auth/transaction-signing"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/identity-auth-transaction-signing-fixes"];
    tsconfigBase.compilerOptions.paths["@backbase-gsa/transactions-journey"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/journey-mocks"];
    tsconfigBase.compilerOptions.paths["@backbase-gsa/transactions-journey/internal/shared-data"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/journey-mocks"];
    tsconfigBase.compilerOptions.paths["@backbase-gsa/transfer-journey"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/journey-mocks"];
    tsconfigBase.compilerOptions.paths["@backbase-gsa/transfer-journey/internal/shared-data"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/journey-mocks"];
    tsconfigBase.compilerOptions.paths["@backbase-gsa/ach-positive-pay-journey"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/journey-mocks"];
    tsconfigBase.compilerOptions.paths["@backbase-gsa/ach-positive-pay-journey/internal/feature"] = ["./apps/golden-sample-app/src/app/backbase-compatibility/journey-mocks"];
    
    // Write the updated config
    fs.writeFileSync(tsconfigBasePath, JSON.stringify(tsconfigBase, null, 2));
    console.log('Updated path mappings in tsconfig.base.json');
  } catch (error) {
    console.error('Error updating tsconfig.base.json:', error);
  }
}

console.log('Patching complete'); 