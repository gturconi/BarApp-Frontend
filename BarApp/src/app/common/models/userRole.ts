export class UserRole {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static roleTranslations: { [key: string]: string } = {
    admin: 'Administrador',
    employee: 'Empleado',
    customer: 'Cliente',
  };

  getTranslatedName(): string {
    const translatedName = UserRole.roleTranslations[this.name];
    return translatedName || this.name;
  }
}
