"use strict";
// import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
// import { User } from "./User";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
// @Entity({
//     name: "appointments"
// })
// export class Appointment {
//     @PrimaryGeneratedColumn()
//     id: number;
//     @Column()
//     date: Date;
//     @Column()
//     time: string;
//     @Column()
//     userId: number;
//     @Column({
//         type: "enum",
//         enum: ["active", "cancelled"],
//         default: "active"
//     })
//     status: "active" | "cancelled";
//     @Column({
//         type: "boolean",
//         default: false // ⬅️ Por defecto no se envió el recordatorio
//     })
//     reminderSent: boolean;
//     @ManyToOne(() => User, (user) => user.appointments)
//     user: User;
// }
// src/entities/Appointment.ts
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let Appointment = class Appointment {
};
exports.Appointment = Appointment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Appointment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Appointment.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Appointment.prototype, "time", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Appointment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["active", "cancelled"],
        default: "active" // Por defecto, los turnos están activos
    }),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "boolean",
        default: false // Por defecto, no se ha enviado el recordatorio
    }),
    __metadata("design:type", Boolean)
], Appointment.prototype, "reminderSent", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 50,
        default: ""
    }),
    __metadata("design:type", String)
], Appointment.prototype, "comentarios", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.appointments),
    __metadata("design:type", User_1.User)
], Appointment.prototype, "user", void 0);
exports.Appointment = Appointment = __decorate([
    (0, typeorm_1.Entity)({
        name: "appointments"
    })
], Appointment);
