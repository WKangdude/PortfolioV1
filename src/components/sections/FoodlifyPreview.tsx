import styles from './FoodlifyPreview.module.css';
export function FoodlifyPreview() {
  return (
    <div
      className={styles.window}
      role="img"
      aria-label="Representación conceptual de Foodlify: tablero de cocina con comandas por preparar, en preparación y listas"
    >
      <div className={styles.windowBar}>
        <div>
          <i />
          <i />
          <i />
        </div>
        <span>Foodlify / Cocina</span>
        <span>↗</span>
      </div>
      <div className={styles.app}>
        <div className={styles.rail}>
          <b>
            f<span>.</span>
          </b>
          <span className={styles.railActive}>▦</span>
          <span>☷</span>
          <span>♧</span>
          <span>⚙</span>
        </div>
        <div className={styles.dashboard}>
          <div className={styles.appHeading}>
            <div>
              <span>Todo en su punto</span>
              <h4>Tu cocina, conectada.</h4>
            </div>
            <span className={styles.live}>
              <i />
              En vivo
            </span>
          </div>
          <div className={styles.aiNote}>
            <span>✧</span>
            <div>
              <b>Un ingrediente extra: inteligencia artificial.</b>
              <p>Menú y operación en un mismo lugar.</p>
            </div>
          </div>
          <div className={styles.columns}>
            {[
              {
                title: 'Por preparar',
                tone: 'orange',
                table: 'Mesa 04',
                dish: 'Pasta al pesto',
                time: 'Hace 2 min',
              },
              {
                title: 'En preparación',
                tone: 'purple',
                table: 'Mesa 08',
                dish: 'Hamburguesa de la casa',
                time: 'Hace 5 min',
              },
              {
                title: 'Listo para servir',
                tone: 'green',
                table: 'Mesa 02',
                dish: 'Ensalada de temporada',
                time: 'Hace 8 min',
              },
            ].map((item) => (
              <div className={styles.column} key={item.title}>
                <div className={styles.columnTitle}>
                  <i data-tone={item.tone} />
                  {item.title}
                  <span>1</span>
                </div>
                <div className={styles.ticket}>
                  <div>
                    <b>{item.table}</b>
                    <span>•••</span>
                  </div>
                  <small>{item.time}</small>
                  <p>
                    <span>1×</span> {item.dish}
                  </p>
                  <div className={styles.ticketNote}>Comanda recibida</div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.appFooter}>
            <span>
              <i />
              Sincronizado con el restaurante
            </span>
            <span>Foodlify</span>
          </div>
        </div>
      </div>
    </div>
  );
}
