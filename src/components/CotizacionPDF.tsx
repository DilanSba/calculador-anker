// @ts-ignore
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

export type PdfMode = 'cash' | 'homedepot' | 'sync';

export interface CotizacionPDFProps {
  cartItems: Array<{
    id: string;
    name: string;
    qty: number;
    cashPrice: number;
    syncPrice: number;
    syncPay12: number;
    syncPay24: number;
    syncPay48: number;
  }>;
  pdfModes: PdfMode[];
  pdfSyncTerms: ('12' | '24' | '48')[];
  downPayment: number;
  consultor: { nombre: string; correo: string; telefono: string; };
  cliente: { nombre: string; correo: string; telefono: string; direccion: string; };
}

const BLUE       = '#00AEEF';
const ORANGE     = '#F97316';
const GREEN      = '#10B981';
const BG         = '#0A1628';
const ROW_ODD    = '#0D1F38';
const ROW_EVEN   = '#0A1628';
const TEXT_MAIN  = '#FFFFFF';
const TEXT_SEC   = '#A0AEC0';

const MODE_META: Record<PdfMode, { label: string; color: string }> = {
  cash:      { label: 'CASH',       color: BLUE },
  homedepot: { label: 'HOME DEPOT', color: ORANGE },
  sync:      { label: 'SYNCHRONY',  color: GREEN },
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: BG,
    padding: 28,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: TEXT_MAIN,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logo: { height: 46, objectFit: 'contain' },
  ankerTitle: {
    color: BLUE,
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 4,
  },
  divider: { height: 2, backgroundColor: BLUE, marginBottom: 8 },
  cotizacionTitle: {
    color: TEXT_MAIN,
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 3,
  },
  cotizacionSubtitle: {
    color: TEXT_SEC,
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  dataBlock: {
    flexDirection: 'row',
    backgroundColor: ROW_ODD,
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
    gap: 10,
  },
  dataCol: { flex: 1 },
  dataColHeader: {
    color: BLUE,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    marginBottom: 5,
  },
  dataRow: { flexDirection: 'row', marginBottom: 3, alignItems: 'flex-start' },
  dataLabel: { color: TEXT_SEC, fontSize: 7, width: 62, flexShrink: 0 },
  dataValue: { color: TEXT_MAIN, fontSize: 8, fontFamily: 'Helvetica-Bold', flex: 1 },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 3,
    marginBottom: 1,
    backgroundColor: BLUE,
  },
  tableHeaderCell: { color: TEXT_MAIN, fontSize: 8, fontFamily: 'Helvetica-Bold' },
  tableRow: { flexDirection: 'row', paddingHorizontal: 6, paddingVertical: 4 },
  tableCell: { color: TEXT_MAIN, fontSize: 7.5 },
  totalsSection: { marginTop: 10, marginBottom: 12 },
  totalsRow: { flexDirection: 'row', gap: 6 },
  totalBox: { flex: 1, borderRadius: 4, overflow: 'hidden' },
  totalBoxHeader: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'center',
  },
  totalBoxHeaderText: {
    color: TEXT_MAIN,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  totalBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: ROW_ODD,
  },
  totalBoxLabel: { color: TEXT_SEC, fontSize: 7 },
  totalBoxValue: { color: TEXT_MAIN, fontSize: 7, fontFamily: 'Helvetica-Bold' },
  totalBoxHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  totalBoxHighlightLabel: { color: TEXT_MAIN, fontSize: 9, fontFamily: 'Helvetica-Bold' },
  totalBoxHighlightValue: { color: TEXT_MAIN, fontSize: 9, fontFamily: 'Helvetica-Bold' },
  disclaimer: {
    color: TEXT_SEC,
    fontSize: 7,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 1.5,
  },
  footer: {
    backgroundColor: BLUE,
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  footerText: {
    color: TEXT_MAIN,
    fontSize: 7.5,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
  },
});

const fmt = (n: number) => '$' + n.toFixed(2);

type EffCol = { key: string; label: string; color: string; isSyncMode: boolean; syncTerm?: '12' | '24' | '48' };

export default function CotizacionPDF(props: CotizacionPDFProps) {
  const { cartItems, pdfModes, pdfSyncTerms, downPayment, consultor, cliente } = props;

  const cotizacionNum = 'WH-' + Date.now();
  const fechaStr = new Date().toLocaleDateString('es-PR');

  // Expand pdfModes: each 'sync' entry becomes one column per selected term
  const effCols: EffCol[] = pdfModes.flatMap(mode => {
    if (mode === 'sync') {
      return pdfSyncTerms.map(t => ({
        key: `sync-${t}`,
        label: `SYNC ${t}M`,
        color: GREEN,
        isSyncMode: true,
        syncTerm: t,
      }));
    }
    return [{ key: mode, label: MODE_META[mode].label, color: MODE_META[mode].color, isSyncMode: false }];
  });

  const isSingle = effCols.length === 1;

  const getColPrice = (item: typeof cartItems[0], col: EffCol) => {
    if (!col.isSyncMode) return item.cashPrice;
    if (col.syncTerm === '12') return item.syncPay12;
    if (col.syncTerm === '24') return item.syncPay24;
    return item.syncPay48;
  };

  const getColGrandTotal = (col: EffCol) =>
    cartItems.reduce((acc, item) => acc + getColPrice(item, col) * item.qty, 0);

  const numCols = effCols.length;
  const productColW = isSingle ? '44%' : numCols === 2 ? '38%' : numCols === 3 ? '32%' : '28%';
  const qtyColW = '8%';
  const remainingPct = isSingle ? 48 : numCols === 2 ? 54 : numCols === 3 ? 60 : 64;
  const modeColW = (remainingPct / numCols).toFixed(1) + '%';

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>

        {/* HEADER */}
        <View style={styles.headerRow}>
          <Image src="https://i.postimg.cc/44pJ0vXw/logo.png" style={styles.logo} />
          <Text style={styles.ankerTitle}>ANKER</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.cotizacionTitle}>COTIZACIÓN FORMAL</Text>
        <Text style={styles.cotizacionSubtitle}>BATERÍAS PORTÁTILES · WINDMAR HOME</Text>

        {/* DATA BLOCK */}
        <View style={styles.dataBlock}>
          <View style={styles.dataCol}>
            <Text style={styles.dataColHeader}>CONSULTOR</Text>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nombre:</Text>
              <Text style={styles.dataValue}>{consultor.nombre}</Text>
            </View>
            {consultor.correo ? (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Correo:</Text>
                <Text style={styles.dataValue}>{consultor.correo}</Text>
              </View>
            ) : null}
            {consultor.telefono ? (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Teléfono:</Text>
                <Text style={styles.dataValue}>{consultor.telefono}</Text>
              </View>
            ) : null}
            <View style={{ marginTop: 6 }}>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>N° Cotización:</Text>
                <Text style={styles.dataValue}>{cotizacionNum}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Fecha:</Text>
                <Text style={styles.dataValue}>{fechaStr}</Text>
              </View>
            </View>
          </View>

          <View style={styles.dataCol}>
            <Text style={styles.dataColHeader}>CLIENTE</Text>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nombre:</Text>
              <Text style={styles.dataValue}>{cliente.nombre}</Text>
            </View>
            {cliente.correo ? (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Correo:</Text>
                <Text style={styles.dataValue}>{cliente.correo}</Text>
              </View>
            ) : null}
            {cliente.telefono ? (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Teléfono:</Text>
                <Text style={styles.dataValue}>{cliente.telefono}</Text>
              </View>
            ) : null}
            {cliente.direccion ? (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Dirección:</Text>
                <Text style={styles.dataValue}>{cliente.direccion}</Text>
              </View>
            ) : null}
            <View style={{ marginTop: 6 }}>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Validez:</Text>
                <Text style={styles.dataValue}>30 días</Text>
              </View>
            </View>
          </View>
        </View>

        {/* PRODUCTS TABLE */}
        {isSingle ? (
          /* ─── SINGLE COLUMN: classic layout ─── */
          <>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: '44%' }]}>PRODUCTO</Text>
              <Text style={[styles.tableHeaderCell, { width: '20%' }]}>
                {effCols[0].label}{effCols[0].isSyncMode ? '/MES' : ''}
              </Text>
              <Text style={[styles.tableHeaderCell, { width: '10%', textAlign: 'center' }]}>CANT</Text>
              <Text style={[styles.tableHeaderCell, { width: '26%', textAlign: 'right' }]}>TOTAL</Text>
            </View>
            {cartItems.map((item, idx) => {
              const unit = getColPrice(item, effCols[0]);
              const total = unit * item.qty;
              const bg = idx % 2 === 0 ? ROW_ODD : ROW_EVEN;
              return (
                <View key={item.id} style={[styles.tableRow, { backgroundColor: bg }]}>
                  <Text style={[styles.tableCell, { width: '44%' }]}>{item.name}</Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{fmt(unit)}{effCols[0].isSyncMode ? '/m' : ''}</Text>
                  <Text style={[styles.tableCell, { width: '10%', textAlign: 'center' }]}>{item.qty}</Text>
                  <Text style={[styles.tableCell, { width: '26%', textAlign: 'right' }]}>{fmt(total)}{effCols[0].isSyncMode ? '/m' : ''}</Text>
                </View>
              );
            })}
          </>
        ) : (
          /* ─── MULTI COLUMN: one column per effective mode ─── */
          <>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: productColW }]}>PRODUCTO</Text>
              <Text style={[styles.tableHeaderCell, { width: qtyColW, textAlign: 'center' }]}>CANT</Text>
              {effCols.map(col => (
                <Text key={col.key} style={[styles.tableHeaderCell, { width: modeColW, textAlign: 'right', color: TEXT_MAIN }]}>
                  {col.label}{col.isSyncMode ? '/m' : ''}
                </Text>
              ))}
            </View>
            {cartItems.map((item, idx) => {
              const bg = idx % 2 === 0 ? ROW_ODD : ROW_EVEN;
              return (
                <View key={item.id} style={[styles.tableRow, { backgroundColor: bg }]}>
                  <Text style={[styles.tableCell, { width: productColW }]}>{item.name}</Text>
                  <Text style={[styles.tableCell, { width: qtyColW, textAlign: 'center' }]}>{item.qty}</Text>
                  {effCols.map(col => (
                    <Text key={col.key} style={[styles.tableCell, { width: modeColW, textAlign: 'right' }]}>
                      {fmt(getColPrice(item, col) * item.qty)}{col.isSyncMode ? '/m' : ''}
                    </Text>
                  ))}
                </View>
              );
            })}
          </>
        )}

        {/* TOTALS — max 3 boxes per row */}
        {(() => {
          const syncTotalBase = cartItems.reduce((acc, it) => acc + it.syncPrice * it.qty, 0);
          const chunks: EffCol[][] = [];
          for (let i = 0; i < effCols.length; i += 3) chunks.push(effCols.slice(i, i + 3));
          return (
            <View style={styles.totalsSection}>
              {chunks.map((chunk, ci) => (
                <View key={ci} style={[styles.totalsRow, ci > 0 ? { marginTop: 6 } : {}]}>
                  {chunk.map(col => {
                    const grandTotal = getColGrandTotal(col);
                    const financed = col.isSyncMode ? Math.max(0, syncTotalBase - downPayment) : 0;
                    return (
                      <View key={col.key} style={styles.totalBox}>
                        <View style={[styles.totalBoxHeader, { backgroundColor: col.color }]}>
                          <Text style={styles.totalBoxHeaderText}>{col.label}</Text>
                        </View>
                        {col.isSyncMode && downPayment > 0 && (
                          <>
                            <View style={styles.totalBoxRow}>
                              <Text style={styles.totalBoxLabel}>Precio Sync</Text>
                              <Text style={styles.totalBoxValue}>{fmt(syncTotalBase)}</Text>
                            </View>
                            <View style={[styles.totalBoxRow, { backgroundColor: ROW_EVEN }]}>
                              <Text style={styles.totalBoxLabel}>Down Payment</Text>
                              <Text style={styles.totalBoxValue}>{fmt(downPayment)}</Text>
                            </View>
                            <View style={styles.totalBoxRow}>
                              <Text style={styles.totalBoxLabel}>A financiar</Text>
                              <Text style={styles.totalBoxValue}>{fmt(financed)}</Text>
                            </View>
                          </>
                        )}
                        <View style={[styles.totalBoxHighlight, { backgroundColor: col.color }]}>
                          <Text style={styles.totalBoxHighlightLabel}>
                            {col.isSyncMode ? `CUOTA ${col.syncTerm}M` : 'TOTAL'}
                          </Text>
                          <Text style={styles.totalBoxHighlightValue}>
                            {fmt(grandTotal)}{col.isSyncMode ? '/m' : ''}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          );
        })()}

        {/* DISCLAIMER */}
        <Text style={styles.disclaimer}>
          Precios referenciales. Financiamiento sujeto a aprobación de Synchrony Financial.{'\n'}
          Windmar Home — Distribuidor Exclusivo Anker en Puerto Rico y El Caribe.
        </Text>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            787.395.7766  |  windmar.com  |  ventas@windmarhome.com  |  © Windmar Home 2025
          </Text>
        </View>
      </Page>
    </Document>
  );
}
