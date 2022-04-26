import express from 'express';

export interface RegistrableController {
  registerRoutes(app: express.Application): void;
}
