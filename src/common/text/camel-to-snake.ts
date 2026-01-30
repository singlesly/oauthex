export class CamelToSnake {
  constructor(private readonly camel: string) {}

  toSnake(): string {
    return this.camel
      .replace(/([A-Z])/g, '_$1') // Добавляем _ перед заглавными
      .replace(/^_/, '') // Удаляем _ в начале строки
      .toLowerCase(); // Приводим к нижнему регистру
  }
}
