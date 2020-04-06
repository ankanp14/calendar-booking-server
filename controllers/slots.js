const Slot = require('../models/slots');

let addSlots = (userId, date, slots) => {
    return Slot.find({ userId, date })
        .then((result) => {
            let slotsToAdd = [];
            for(let i = 0; i < slots.length; i++) {
                let slotExists = false;
                for(let j = 0; j < result.length; j++) {
                    // check and remove redundant slots
                    if (slots[i].startTime === result[j].startTime && slots[i].endTime === result[j].endTime) {
                        slotExists = true;
                        break;
                    }
                }
                if (!slotExists) {
                    slotsToAdd.push({
                        userId: userId,
                        date: date,
                        startTime: slots[i].startTime,
                        endTime: slots[i].endTime,
                        createdAt: new Date().toISOString()
                    });
                }
            }

            if (!slotsToAdd.length) {
                return [];
            }

            return Slot.insertMany(slotsToAdd);
        })
        .then((data) => {
            return {
                status: true,
                message: "Slots saved successfully",
                data
            };
        })
        .catch((err) => {
            console.log(err);
            return err;
        })
};

let deleteSlot = (id) => {
    return Slot.findOneAndDelete({ _id: id })
        .then((result) => {
            if (!result) {
                return {
                    status: true,
                    message: "Slot does not exist"
                };
            }
            return {
                status: true,
                message: "Slot deleted successfully",
                details: result
            };
        })
        .catch((err) => {
            console.log(err);
            return err;
        })
};

let getSlots = (userId, date) => {
    return Slot.find({ userId, date })
        .then((result) => {
            return {
                status: true,
                message: `${result.length} slots found`,
                data: result
            };
        })
        .catch((err) => {
            console.log(err);
            return err;
        });
}

module.exports = {
   addSlots,
   deleteSlot,
   getSlots
};