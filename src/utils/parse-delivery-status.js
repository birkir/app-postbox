export default function parseDeliveryStatus(description, location) {

  const result = {
    code: 'UNKNOWN',
    icon: 'keyboard-arrow-right',
  };

  if (description.match(/[eE]rlend/)) {
    result.code = 'IN_TRANSIT';
    result.icon = 'flight';
  }

  if (description.match(/Kom til landsins/) || location.match(/ISREKA/)) {
    result.code = 'ARRIVED';
    result.icon = 'flight-land';
  }

  if (description.match(/Greitt/)) {
    result.code = 'CUSTOMS_PAID';
    result.icon = 'payment';
  }

  if (description.match(/Beðið eftir gögnum|[Tt]ollalager/)) {
    result.code = 'CUSTOMS_WAITING';
    result.icon = 'timelapse';
  }

  if (description.match(/reiknuð/)) {
    result.code = 'CUSTOMS_PROCESSING';
    result.icon = 'local-offer';
  }

  if (description.match(/Innsendur reikningur/)) {
    result.code = 'CUSTOMS_DOCUMENT';
    result.icon = 'mail';
  }

  if (location.match(/Útkeyrsla|send frá pósthúsi/)) {
    result.code = 'OUT_FOR_DELIVERY';
    result.icon = 'local-shipping';
  }

  if (location.match(/[mM]issent/)) {
    result.code = 'FAILED_DELIVERY';
    result.icon = 'warning';
  }

  if (description.match(/[aA]fhent|[aA]fhending bókuð/)) {
    result.code = 'DELIVERED';
    result.icon = 'done';
  }

  return result;
}
