export const ACTION_DESTINATION_CHANGED = 'ACTION_DESTINATION_CHANGED';

export function updateDestination(destination) {
    if (destination.title.length === 0) {
        destination = null;
    }

    return {
        type: ACTION_DESTINATION_CHANGED,
        destination,
    };
}