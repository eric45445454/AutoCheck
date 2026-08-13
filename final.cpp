#include <iostream>
#include <string>
using namespace std;

const int MAX_VEHICULOS = 20;
const int CANT_SERVICIOS = 5;
const string SERVICIOS[CANT_SERVICIOS] = {
    "Aceite", "Frenos", "Rotacion", "Filtro de aire", "Bujias"
};
const int INTERVALOS[CANT_SERVICIOS] = {8000, 10000, 10000, 20000, 100000};

string clientes[MAX_VEHICULOS], placas[MAX_VEHICULOS];
string marcas[MAX_VEHICULOS], modelos[MAX_VEHICULOS];
int anios[MAX_VEHICULOS], kilometrajes[MAX_VEHICULOS];
int primerServicio[MAX_VEHICULOS];
bool mantenimientoRegistrado[MAX_VEHICULOS];
bool problemaMotor[MAX_VEHICULOS], problemaFrenos[MAX_VEHICULOS];
bool problemaSuspension[MAX_VEHICULOS], problemaElectrico[MAX_VEHICULOS];
int cantidadVehiculos = 0;

int buscarIndicePorPlaca(string placaBuscada) {
    for (int i = 0; i < cantidadVehiculos; i++)
        if (placas[i] == placaBuscada) return i;
    return -1;
}

int seleccionarVehiculo() {
    string placa;
    cout << "Placa: ";
    cin >> placa;
    int i = buscarIndicePorPlaca(placa);
    if (i == -1) cout << "Vehiculo no encontrado.\n";
    return i;
}

void mostrarUno(int i) {
    cout << "\n" << i + 1 << ". " << marcas[i] << " " << modelos[i]
         << " | Placa: " << placas[i] << " | Anio: " << anios[i]
         << " | Km: " << kilometrajes[i] << " | Cliente: " << clientes[i] << "\n";
}

void registrarVehiculo() {
    if (cantidadVehiculos == MAX_VEHICULOS) {
        cout << "No hay espacio disponible.\n";
        return;
    }
    int i = cantidadVehiculos;
    cout << "Nombre del cliente: ";
    getline(cin >> ws, clientes[i]);
    cout << "Placa: ";
    cin >> placas[i];
    if (buscarIndicePorPlaca(placas[i]) != -1) {
        cout << "Esa placa ya esta registrada.\n";
        return;
    }
    cout << "Marca: "; cin >> marcas[i];
    cout << "Modelo: "; cin >> modelos[i];
    cout << "Anio: "; cin >> anios[i];
    cout << "Kilometraje actual: "; cin >> kilometrajes[i];
    cantidadVehiculos++;
    cout << "Vehiculo registrado.\n";
}

void mostrarVehiculos() {
    if (cantidadVehiculos == 0) cout << "No hay vehiculos registrados.\n";
    for (int i = 0; i < cantidadVehiculos; i++) mostrarUno(i);
}

void buscarVehiculo() {
    int i = seleccionarVehiculo();
    if (i != -1) mostrarUno(i);
}

void registrarPrimerMantenimiento() {
    int i = seleccionarVehiculo();
    if (i == -1) return;
    cout << "Kilometraje del primer servicio: ";
    cin >> primerServicio[i];
    mantenimientoRegistrado[i] = true;
    cout << "Mantenimiento registrado.\n";
}

bool leerProblema(string texto) {
    string respuesta;
    cout << texto << " (1/si = Si, 0/no = No): ";
    cin >> respuesta;
    return respuesta == "1" || respuesta == "si" ||
           respuesta == "Si" || respuesta == "SI";
}

void registrarDiagnostico() {
    int i = seleccionarVehiculo();
    if (i == -1) return;
    problemaMotor[i] = leerProblema("Problema de motor");
    problemaFrenos[i] = leerProblema("Problema de frenos");
    problemaSuspension[i] = leerProblema("Problema de suspension");
    problemaElectrico[i] = leerProblema("Problema electrico");
    cout << "Diagnostico registrado.\n";
}

void consultarMantenimiento() {
    int i = seleccionarVehiculo();
    if (i == -1) return;
    if (!mantenimientoRegistrado[i]) {
        cout << "Este vehiculo no tiene un primer mantenimiento registrado.\n";
        return;
    }
    cout << "Intervalos estimados para esta simulacion:\n";
    for (int s = 0; s < CANT_SERVICIOS; s++) {
        int faltan = primerServicio[i] + INTERVALOS[s] - kilometrajes[i];
        cout << SERVICIOS[s] << ": ";
        if (faltan < 0) cout << "VENCIDO por " << -faltan << " km";
        else if (faltan == 0) cout << "CORRESPONDE AHORA";
        else if (faltan > 0 && faltan <= 1000)
            cout << "faltan " << faltan << " km (PROXIMO)";
        else cout << "faltan " << faltan << " km";
        cout << "\n";
    }
}

void mostrarAlertas() {
    if (cantidadVehiculos == 0) cout << "No hay vehiculos registrados.\n";
    for (int i = 0; i < cantidadVehiculos; i++) {
        mostrarUno(i);
        bool tieneProblema = problemaMotor[i] || problemaFrenos[i] ||
                             problemaSuspension[i] || problemaElectrico[i];
        if (problemaMotor[i]) cout << "ALERTA: Revisar motor\n";
        if (problemaFrenos[i]) cout << "ALERTA: Revisar frenos\n";
        if (problemaSuspension[i]) cout << "ALERTA: Revisar suspension\n";
        if (problemaElectrico[i]) cout << "ALERTA: Revisar sistema electrico\n";
        if (!tieneProblema) cout << "Vehiculo sin alertas.\n";
    }
}

void mostrarEstadisticas() {
    int conProblemas = 0, sumaKm = 0;
    for (int i = 0; i < cantidadVehiculos; i++) {
        sumaKm += kilometrajes[i];
        if (problemaMotor[i] || problemaFrenos[i] ||
            problemaSuspension[i] || problemaElectrico[i]) conProblemas++;
    }
    cout << "Vehiculos registrados: " << cantidadVehiculos << "\n"
         << "Vehiculos con problemas: " << conProblemas << "\n"
         << "Vehiculos sin problemas: " << cantidadVehiculos - conProblemas << "\n";
    if (cantidadVehiculos > 0)
        cout << "Promedio de kilometraje: " << sumaKm / cantidadVehiculos << " km\n";
}

void mostrarMenu() {
    cout << "\n========== AUTOCHECK ==========\n"
         << "1. Registrar vehiculo\n2. Mostrar vehiculos\n3. Buscar vehiculo\n"
         << "4. Registrar primer mantenimiento\n5. Registrar diagnostico\n"
         << "6. Consultar mantenimientos\n7. Mostrar alertas\n"
         << "8. Mostrar estadisticas\n9. Salir\nOpcion: ";
}

int main() {
    int opcion;
    do {
        mostrarMenu();
        cin >> opcion;
        switch (opcion) {
            case 1: registrarVehiculo(); break;
            case 2: mostrarVehiculos(); break;
            case 3: buscarVehiculo(); break;
            case 4: registrarPrimerMantenimiento(); break;
            case 5: registrarDiagnostico(); break;
            case 6: consultarMantenimiento(); break;
            case 7: mostrarAlertas(); break;
            case 8: mostrarEstadisticas(); break;
            case 9: cout << "Gracias por usar AutoCheck.\n"; break;
            default: cout << "Opcion invalida.\n";
        }
    } while (opcion != 9);
    return 0;
}
