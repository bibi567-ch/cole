export default function Home() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Bienvenido a EduRural Connect</h1>
      <p>Sistema de gestión escolar y comunitaria</p>
      <div style={{ marginTop: '30px' }}>
        <a href="/login" style={{ marginRight: '20px', padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Iniciar Sesión
        </a>
        <a href="/register" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Registrarse
        </a>
      </div>
    </div>
  );
}