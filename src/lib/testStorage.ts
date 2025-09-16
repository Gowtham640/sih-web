import { supabase } from './supabase';

export const testStorageConnection = async () => {
  try {
    // Test 1: Check if we can list buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    console.log('Buckets:', buckets, 'Error:', bucketsError);

    // Test 2: Check if we can list files in the drill-media bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('drill-media')
      .list('', { limit: 1 });
    console.log('Files in drill-media:', files, 'Error:', filesError);

    // Test 3: Try to create a simple text file
    const testFile = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('drill-media')
      .upload('test-' + Date.now() + '.txt', testFile);
    console.log('Upload test:', uploadData, 'Error:', uploadError);

    return {
      bucketsTest: !bucketsError,
      listTest: !filesError,
      uploadTest: !uploadError
    };
  } catch (error) {
    console.error('Storage test failed:', error);
    return {
      bucketsTest: false,
      listTest: false,
      uploadTest: false,
      error: error
    };
  }
};
