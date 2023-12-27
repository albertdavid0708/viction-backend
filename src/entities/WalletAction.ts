import "reflect-metadata";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityWithTimestamps } from "./Base";
import { Contract } from "./Contract";

@Entity("wallet_action")
export class WalletAction extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column()
  signature: string;

  @Column()
  data: string;

  @Column()
  address: string;

  @ManyToOne(() => Contract, (contract) => contract.trxs)
  @JoinColumn({name: "contract_id"})
  contract: Contract;
}
