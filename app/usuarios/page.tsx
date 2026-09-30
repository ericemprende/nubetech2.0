import { Badge } from "@/components/ui/badge";
import { USUARIOS } from "@/lib/mock-data";

/** Gestión de usuarios — puerto inicial de `UsersView`. Roles y permisos son TODO. */
export default function UsuariosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Usuarios</h1>
        <p className="text-sm text-muted-foreground">
          Administra quién tiene acceso a tu espacio de trabajo.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {USUARIOS.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3">{u.nombre}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3">{u.rol}</td>
                <td className="p-3">
                  <Badge variant={u.activo ? "default" : "muted"}>
                    {u.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
