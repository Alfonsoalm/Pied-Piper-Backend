
// Clase con los metodos relacionado con la empresa y sus datos
class Company {
    constructor({ id, legal_Id, name, email, industry = '', size = '', location = '' }) {
        this.id = id;
        this.legal_Id = legal_Id;
        this.name = name;
        this.email = email;
        this.industry = industry;
        this.size = size;
        this.location = location;
    }

    // Crear una empresa
    static create(data) {
        const newCompany = new Company(data);
        localStorage.setItem(`company_${newCompany.id}`, JSON.stringify(newCompany));
        return newCompany;
    }

    // Actualizar empresa
    updateProfile({ name, email, industry, size, location }) {
        this.name = name || this.name;
        this.email = email || this.email;
        this.industry = industry || this.industry;
        this.size = size || this.size;
        this.location = location || this.location;
        this.saveToLocal();
    }

    // Guardar en localStorage
    saveToLocal() {
        localStorage.setItem(`company_${this.id}`, JSON.stringify(this));
    }

    // Cargar desde localStorage
    static loadFromLocal(id) {
        const data = JSON.parse(localStorage.getItem(`company_${id}`));
        return data ? new Company(data) : null;
    }
}

export default Company;
