import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { CategoryGroup, ICategoryGroup } from '@anyshop/core';
import { SerializableFirebaseCollection } from '../firebase/serializable-firebase-collection';

@Injectable({
  providedIn: 'root'
})
export class CategoryGroupsService extends SerializableFirebaseCollection<ICategoryGroup, CategoryGroup> {
  constructor(public afs: AngularFirestore) {
    super('/category_groups', afs);
  }

  serialize(action: DocumentChangeAction<ICategoryGroup>): CategoryGroup {
    return new CategoryGroup(action.payload.doc.data(), action.payload.doc.id);
  }
}
