
// Clase que recoge los metodos relacionados con las ofertas y sus datos
class Offer {
    constructor({ id, title, description, salary, required_skills = [], employment_type, location }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.salary = salary;
        this.required_skills = required_skills;
        this.employment_type = employment_type;
        this.location = location;
    }

    // Crear oferta
    static create(data) {
        const newOffer = new Offer(data);
        localStorage.setItem(`offer_${newOffer.id}`, JSON.stringify(newOffer));
        return newOffer;
    }

    // Actualizar oferta
    updateOffer({ title, description, salary, required_skills, employment_type, location }) {
        this.title = title || this.title;
        this.description = description || this.description;
        this.salary = salary || this.salary;
        this.required_skills = required_skills || this.required_skills;
        this.employment_type = employment_type || this.employment_type;
        this.location = location || this.location;
        this.saveToLocal();
    }

    // Guardar en localStorage
    saveToLocal() {
        localStorage.setItem(`offer_${this.id}`, JSON.stringify(this));
    }

    // Cargar desde localStorage
    static loadFromLocal(id) {
        const data = JSON.parse(localStorage.getItem(`offer_${id}`));
        return data ? new Offer(data) : null;
    }
}

export default Offer;
