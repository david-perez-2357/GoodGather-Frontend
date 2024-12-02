/**
 * Saves a value in LocalStorage under the specified key.
 * @param key - The key to store the value under.
 * @param value - The value to store. It will be serialized to JSON.
 */
function setItem<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Failed to save item with key "${key}" to LocalStorage:`, error);
  }
}

/**
 * Retrieves a value from LocalStorage.
 * @param key - The key of the value to retrieve.
 * @returns The parsed value, or null if the key does not exist or parsing fails.
 */
function getItem<T>(key: string): T | null {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error(`Failed to retrieve item with key "${key}" from LocalStorage:`, error);
    return null;
  }
}

/**
 * Removes an item from LocalStorage.
 * @param key - The key of the item to remove.
 */
function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item with key "${key}" from LocalStorage:`, error);
  }
}

/**
 * Clears all items from LocalStorage.
 */
function clearStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Failed to clear LocalStorage:", error);
  }
}

/**
 * Checks if a key exists in LocalStorage.
 * @param key - The key to check.
 * @returns True if the key exists, false otherwise.
 */
function exists(key: string): boolean {
  return localStorage.getItem(key) !== null;
}

export { setItem, getItem, removeItem, clearStorage, exists };
