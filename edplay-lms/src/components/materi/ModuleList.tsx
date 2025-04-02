'use client';

interface Module {
  id: number;
  title: string;
}

interface ModuleListProps {
  modules: Module[];
  activeModule: number | null;
  onModuleSelect: (moduleId: number) => void;
}

export default function ModuleList({
  modules,
  activeModule,
  onModuleSelect,
}: ModuleListProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {modules.map((module) => (
        <div
          key={module.id}
          className={`
            flex items-center p-1 border-b last:border-b-0 cursor-pointer 
            hover:bg-[#D0F2FF] transition-colors
            ${activeModule === module.id ? 'bg-[#D0F2FF]' : ''}
          `}
          onClick={() => onModuleSelect(module.id)}
        >
          <div className="bg-[#D0F2FF] text-[#2E3E83] rounded-md text-center mr-2 w-12">
            <div className="text-xs">Modul</div>
            <div className="font-bold">{module.id}</div>
          </div>
          <span className="text-sm font-bold">{module.title}</span>
        </div>
      ))}
    </div>
  );
}
