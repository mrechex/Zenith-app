import React, { useRef } from 'react';

interface SettingsViewProps {
    currentTheme: string;
    onSetTheme: (theme: 'light' | 'dark') => void;
    currentAccent: string;
    onSetAccent: (accent: string) => void;
    onClearData: () => void;
    onExportData: () => void;
    onImportData: (data: string) => void;
}

const SettingsCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-secondary p-6 rounded-lg border border-border-color">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-text-primary">{title}</h3>
                <p className="text-sm text-text-secondary mt-1">{description}</p>
            </div>
            <div className="mt-2 md:mt-0 flex items-center shrink-0">
                {children}
            </div>
        </div>
    </div>
);


const SettingsView: React.FC<SettingsViewProps> = ({ currentTheme, onSetTheme, currentAccent, onSetAccent, onClearData, onExportData, onImportData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const accentThemes = [
        { name: 'purple', color: '#8a5cf6' },
        { name: 'blue', color: '#3b82f6' },
        { name: 'green', color: '#22c55e' },
        { name: 'orange', color: '#f97316' },
        { name: 'pink', color: '#ec4899' },
    ];

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                onImportData(text);
            }
        };
        reader.onerror = () => {
            alert('Error al leer el archivo.');
        };
        reader.readAsText(file);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
             <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json" 
                className="hidden" 
            />
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-text-primary">Apariencia</h2>
                    <div className="space-y-4">
                        <SettingsCard
                            title="Tema de la Aplicación"
                            description="Elige cómo quieres que se vea la interfaz."
                        >
                             <div className="flex items-center bg-primary p-1 rounded-lg">
                                <button
                                    onClick={() => onSetTheme('light')}
                                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${currentTheme === 'light' ? 'bg-accent text-white' : 'text-text-secondary hover:bg-border-color'}`}
                                >
                                    Claro
                                </button>
                                <button
                                    onClick={() => onSetTheme('dark')}
                                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${currentTheme === 'dark' ? 'bg-accent text-white' : 'text-text-secondary hover:bg-border-color'}`}
                                >
                                    Oscuro
                                </button>
                            </div>
                        </SettingsCard>
                        <SettingsCard
                            title="Color de Acento"
                            description="Personaliza el color principal de la interfaz."
                        >
                            <div className="flex items-center gap-3">
                                {accentThemes.map(theme => (
                                    <button
                                        key={theme.name}
                                        onClick={() => onSetAccent(theme.name)}
                                        className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${currentAccent === theme.name ? 'ring-2 ring-offset-2 ring-offset-secondary ring-white' : ''}`}
                                        style={{ backgroundColor: theme.color }}
                                        aria-label={`Seleccionar tema ${theme.name}`}
                                    />
                                ))}
                            </div>
                        </SettingsCard>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-text-primary">Gestión de Datos</h2>
                     <div className="space-y-4">
                        <SettingsCard
                            title="Exportar Datos"
                            description="Guarda una copia de seguridad de todos tus datos en un archivo."
                        >
                            <button onClick={onExportData} className="bg-primary text-text-primary font-semibold py-2 px-4 rounded-lg border border-border-color hover:bg-border-color transition-colors">
                                Exportar
                            </button>
                        </SettingsCard>
                         <SettingsCard
                            title="Importar Datos"
                            description="Carga datos desde un archivo de copia de seguridad."
                        >
                            <button onClick={handleImportClick} className="bg-primary text-text-primary font-semibold py-2 px-4 rounded-lg border border-border-color hover:bg-border-color transition-colors">
                                Importar
                            </button>
                        </SettingsCard>
                        <SettingsCard
                            title="Borrar Todos los Datos"
                            description="Elimina permanentemente todos los datos de la aplicación. Esta acción no se puede deshacer."
                        >
                            <button onClick={onClearData} className="bg-red-500/20 text-red-400 font-semibold py-2 px-4 rounded-lg hover:bg-red-500/40 hover:text-red-300 transition-colors">
                                Borrar Datos
                            </button>
                        </SettingsCard>
                     </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4 text-text-primary">Acerca de</h2>
                    <SettingsCard
                        title="Versión de la Aplicación"
                        description="Estás utilizando la última versión de Zenith."
                    >
                        <span className="text-text-primary font-mono bg-primary px-3 py-1 rounded-md border border-border-color">v1.0.0</span>
                    </SettingsCard>
                </div>

            </div>
        </div>
    );
};

export default SettingsView;
