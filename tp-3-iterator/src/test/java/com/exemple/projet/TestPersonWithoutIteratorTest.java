
package com.exemple.projet;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import junit.framework.TestCase;

public class TestPersonWithoutIteratorTest extends TestCase {

    // Test de suppression sécurisée avec un Iterator
    public void testRemovePersonByName() {
        // Préparer les données
        Set<Person> people = new HashSet<>();
        people.add(new Person(1, " Alice "));
        people.add(new Person(2, " Bob "));
        people.add(new Person(3, " Charlie "));

        // Effectuer la suppression
        Iterator<Person> iterator = people.iterator();
        while (iterator.hasNext()) {
            Person person = iterator.next();
            if (person.getName().equals(" Bob ")) {
                iterator.remove(); // Suppression sécurisée
            }
        }

        // Vérifier que "Bob" a été supprimé
        assertEquals(2, people.size());
        assertFalse(people.contains(new Person(2, " Bob ")));
        assertTrue(people.contains(new Person(1, " Alice ")));
        assertTrue(people.contains(new Person(3, " Charlie ")));
    }

    // Test si le Set contient toutes les personnes initialement
    public void testInitialSetContents() {
        // Préparer les données
        Set<Person> people = new HashSet<>();
        people.add(new Person(1, " Alice "));
        people.add(new Person(2, " Bob "));
        people.add(new Person(3, " Charlie "));

        // Vérifier que toutes les personnes sont présentes
        assertEquals(3, people.size());
        assertTrue(people.contains(new Person(1, " Alice ")));
        assertTrue(people.contains(new Person(2, " Bob ")));
        assertTrue(people.contains(new Person(3, " Charlie ")));
    }
}
